import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  BackofficeProduct,
  LoginRequest,
  LoginResponse,
  MarginTaxKpi,
  ProductCategoryKey,
  QuarterAlert,
  RevenueKpi,
  StockMovement,
  StockMovementType,
  StockOperationPayload
} from '../models/backoffice.models';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class BackofficeApiService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly productsStoreKey = 'bo_products_state_v2';
  private readonly movementsStoreKey = 'bo_stock_movements_v2';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    if (environment.useMockBackend) {
      const isValid = payload.username.trim().length > 0 && payload.password.trim().length > 0;
      if (!isValid) {
        return of({ access: '' });
      }
      return of({ access: 'mock-jwt-token' });
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  getProducts(): Observable<BackofficeProduct[]> {
    if (!environment.useMockBackend) {
      return this.http.get<BackofficeProduct[]>(`${this.baseUrl}/products`);
    }

    return this.ensureMockProducts();
  }

  updateProduct(id: number, operation: StockOperationPayload): Observable<BackofficeProduct> {
    if (!environment.useMockBackend) {
      return this.http.patch<BackofficeProduct>(`${this.baseUrl}/products/${id}/stock-movement`, operation);
    }

    return this.ensureMockProducts().pipe(
      map((products) => {
        const nowIso = new Date().toISOString();
        const result = this.applyOperation(products, id, operation, nowIso);
        this.writeProducts(result.products);
        this.appendMovement(result.movement);
        return result.updated;
      })
    );
  }

  bulkUpdate(payload: Array<{ id: number; operation: StockOperationPayload }>): Observable<BackofficeProduct[]> {
    if (!environment.useMockBackend) {
      return this.http.post<BackofficeProduct[]>(`${this.baseUrl}/products/stock-movements/bulk`, { updates: payload });
    }

    return this.ensureMockProducts().pipe(
      map((products) => {
        let nextProducts = [...products];
        const movements: StockMovement[] = [];
        const nowIso = new Date().toISOString();

        for (const row of payload) {
          const result = this.applyOperation(nextProducts, row.id, row.operation, nowIso);
          nextProducts = result.products;
          movements.push(result.movement);
        }

        this.writeProducts(nextProducts);
        this.appendMovements(movements);
        return nextProducts;
      })
    );
  }

  getRevenue(period: string, category: ProductCategoryKey): Observable<RevenueKpi> {
    if (!environment.useMockBackend) {
      return this.http.get<RevenueKpi>(`${this.baseUrl}/kpi/revenue`, {
        params: { period, category }
      });
    }

    return this.ensureMockProducts().pipe(
      map((products) => {
        const movements = this.readMovements();
        const amount = movements
          .filter((m) => m.type === 'sale')
          .filter((m) => this.matchesPeriod(m.occurredAt, period))
          .filter((m) => this.matchesCategory(m, products, category))
          .reduce((sum, m) => sum + m.amount, 0);

        return { amount, period, category };
      })
    );
  }

  getMarginTax(): Observable<MarginTaxKpi> {
    if (!environment.useMockBackend) {
      return this.http.get<MarginTaxKpi>(`${this.baseUrl}/kpi/margin-tax`);
    }

    return this.ensureMockProducts().pipe(
      map(() => {
        const movements = this.readMovements();
        const revenue = movements
          .filter((m) => m.type === 'sale')
          .filter((m) => this.matchesPeriod(m.occurredAt, 'yearly'))
          .reduce((sum, m) => sum + m.amount, 0);
        const purchaseCost = movements
          .filter((m) => m.type === 'add_purchase')
          .filter((m) => this.matchesPeriod(m.occurredAt, 'yearly'))
          .reduce((sum, m) => sum + m.amount, 0);

        const margin = revenue - purchaseCost;
        const tax = margin > 0 ? margin * 0.3 : 0;
        return { revenue, purchaseCost, margin, tax };
      })
    );
  }

  getAlerts(): Observable<QuarterAlert[]> {
    if (!environment.useMockBackend) {
      return this.http.get<QuarterAlert[]>(`${this.baseUrl}/kpi/alerts`);
    }

    return this.ensureMockProducts().pipe(
      map(() => {
        const movements = this.readMovements();
        const quarters = this.buildQuarterSequence(8);
        const quarterMargins = quarters.map((q) => this.computeQuarterMargin(movements, q.year, q.quarter));
        const currentQuarterIndex = quarterMargins.length - 1;

        return quarters.map((q, index) => {
          const margin = quarterMargins[index];
          const prevSix = quarterMargins.slice(Math.max(0, index - 6), index).filter((m) => m > 0);
          const averagePrevSix = prevSix.length ? prevSix.reduce((s, v) => s + v, 0) / prevSix.length : 0;
          const confetti =
            index === currentQuarterIndex &&
            margin > 0 &&
            averagePrevSix > 0 &&
            margin > averagePrevSix * 2;

          if (margin < 0) {
            return {
              quarter: `T${q.quarter} ${q.year}`,
              margin,
              level: 'danger',
              message: 'Alerte: marge negative sur le trimestre.',
              confetti: false
            };
          }

          if (confetti) {
            return {
              quarter: `T${q.quarter} ${q.year}`,
              margin,
              level: 'bonus',
              message: 'Resultat exceptionnel: benefice > 2x moyenne des 6 trimestres precedents.',
              confetti: true
            };
          }

          return {
            quarter: `T${q.quarter} ${q.year}`,
            margin,
            level: 'success',
            message: margin > 0 ? 'Benefice degage sur le trimestre.' : 'Equilibre: ni benefice ni perte.',
            confetti: false
          };
        });
      })
    );
  }

  private ensureMockProducts(): Observable<BackofficeProduct[]> {
    const inStorage = this.readProducts();
    if (inStorage.length > 0) {
      return of(inStorage);
    }

    return this.http.get<Product[]>('assets/data/products.json').pipe(
      map((rows) => rows.map((row) => this.mapJsonProduct(row))),
      map((products) => {
        this.writeProducts(products);
        return products;
      })
    );
  }

  private applyOperation(
    products: BackofficeProduct[],
    productId: number,
    operation: StockOperationPayload,
    occurredAt: string
  ): { products: BackofficeProduct[]; updated: BackofficeProduct; movement: StockMovement } {
    this.assertValidOperation(operation);

    const target = products.find((p) => p.id === productId);
    if (!target) {
      throw new Error('Product not found');
    }

    if ((operation.type === 'sale' || operation.type === 'expired') && operation.qty > target.stockQty) {
      throw new Error('Stock insuffisant pour ce retrait');
    }

    let stockQty = target.stockQty;
    let soldQty = target.soldQty;

    if (operation.type === 'add_purchase') {
      stockQty += operation.qty;
    } else if (operation.type === 'sale') {
      stockQty -= operation.qty;
      soldQty += operation.qty;
    } else {
      stockQty -= operation.qty;
    }

    const discount = operation.discount !== undefined ? operation.discount : target.discount;
    const updated: BackofficeProduct = {
      ...target,
      stockQty,
      soldQty,
      discount,
      sale: discount > 0
    };

    const movement: StockMovement = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      productId: target.id,
      category: target.category,
      type: operation.type,
      qty: operation.qty,
      unitPrice: operation.unitPrice,
      amount: operation.qty * operation.unitPrice,
      occurredAt,
      promotion: updated.sale
    };

    return {
      products: products.map((p) => (p.id === updated.id ? updated : p)),
      updated,
      movement
    };
  }

  private matchesCategory(movement: StockMovement, products: BackofficeProduct[], category: ProductCategoryKey): boolean {
    if (category === 'all') return true;
    if (category === 'promotion') return movement.promotion;
    const product = products.find((p) => p.id === movement.productId);
    if (!product) return false;
    if (category === 'fish') return product.category === 0;
    if (category === 'seafood') return product.category === 1;
    return product.category === 2;
  }

  private matchesPeriod(occurredAt: string, period: string): boolean {
    const date = new Date(occurredAt);
    const now = new Date();

    if (period === 'daily') {
      return date.toDateString() === now.toDateString();
    }

    if (period === 'weekly') {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return date >= start && date <= now;
    }

    if (period === 'monthly') {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    if (period === 'quarterly') {
      return date.getFullYear() === now.getFullYear() && this.getQuarter(date) === this.getQuarter(now);
    }

    return date.getFullYear() === now.getFullYear();
  }

  private buildQuarterSequence(count: number): Array<{ year: number; quarter: number }> {
    const current = new Date();
    let year = current.getFullYear();
    let quarter = this.getQuarter(current);
    const out: Array<{ year: number; quarter: number }> = [];

    for (let i = 0; i < count; i++) {
      out.push({ year, quarter });
      quarter -= 1;
      if (quarter === 0) {
        quarter = 4;
        year -= 1;
      }
    }

    return out.reverse();
  }

  private computeQuarterMargin(movements: StockMovement[], year: number, quarter: number): number {
    const inQuarter = movements.filter((m) => {
      const d = new Date(m.occurredAt);
      return d.getFullYear() === year && this.getQuarter(d) === quarter;
    });

    const revenue = inQuarter.filter((m) => m.type === 'sale').reduce((sum, m) => sum + m.amount, 0);
    const purchaseCost = inQuarter.filter((m) => m.type === 'add_purchase').reduce((sum, m) => sum + m.amount, 0);
    return revenue - purchaseCost;
  }

  private getQuarter(d: Date): number {
    return Math.floor(d.getMonth() / 3) + 1;
  }

  private assertValidOperation(operation: StockOperationPayload): void {
    if (!Number.isInteger(operation.qty) || operation.qty <= 0) {
      throw new Error('Quantite invalide');
    }

    if (operation.type === 'expired') {
      if (operation.unitPrice !== 0) {
        throw new Error('Prix unitaire des invendus doit etre 0');
      }
    } else if (operation.unitPrice <= 0) {
      throw new Error('Prix unitaire invalide');
    }

    if (operation.discount !== undefined && (operation.discount < 0 || operation.discount > 100)) {
      throw new Error('Promotion invalide');
    }
  }

  private mapJsonProduct(row: Product): BackofficeProduct {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      unit: row.unit,
      sale: row.sale,
      discount: row.discount,
      comments: row.comments,
      stockQty: 15 + (row.id % 6) * 4,
      soldQty: 8 + (row.id % 5) * 3
    };
  }

  private readProducts(): BackofficeProduct[] {
    const raw = localStorage.getItem(this.productsStoreKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as BackofficeProduct[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeProducts(products: BackofficeProduct[]): void {
    localStorage.setItem(this.productsStoreKey, JSON.stringify(products));
  }

  private readMovements(): StockMovement[] {
    const raw = localStorage.getItem(this.movementsStoreKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as StockMovement[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private appendMovement(movement: StockMovement): void {
    const rows = this.readMovements();
    rows.push(movement);
    localStorage.setItem(this.movementsStoreKey, JSON.stringify(rows));
  }

  private appendMovements(movements: StockMovement[]): void {
    const rows = this.readMovements();
    rows.push(...movements);
    localStorage.setItem(this.movementsStoreKey, JSON.stringify(rows));
  }
}
