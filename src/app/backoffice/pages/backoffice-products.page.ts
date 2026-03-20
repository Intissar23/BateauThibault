import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonText
} from '@ionic/angular/standalone';

import { BackofficeApiService } from '../services/backoffice-api.service';
import { BackofficeAuthService } from '../services/backoffice-auth.service';
import { BackofficeProduct, StockMovementType, StockOperationPayload } from '../models/backoffice.models';

interface RowDraft {
  movementType: StockMovementType | '';
  qty: string | number | null;
  unitPrice: string | number | null;
  discount: string | number | null;
}

@Component({
  selector: 'app-backoffice-products',
  standalone: true,
  templateUrl: './backoffice-products.page.html',
  styleUrls: ['./backoffice-products.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonText
  ]
})
export class BackofficeProductsPage implements OnInit {
  products: BackofficeProduct[] = [];
  drafts: Record<number, RowDraft> = {};
  rowErrors: Record<number, string> = {};
  globalError = '';
  infoMessage = '';
  loading = false;

  constructor(
    private api: BackofficeApiService,
    private auth: BackofficeAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/backoffice/login']);
      return;
    }
    this.loadProducts();
  }

  get fishProducts(): BackofficeProduct[] {
    return this.products.filter((p) => p.category === 0);
  }

  get seafoodProducts(): BackofficeProduct[] {
    return this.products.filter((p) => p.category === 1);
  }

  get crustaceanProducts(): BackofficeProduct[] {
    return this.products.filter((p) => p.category === 2);
  }

  getPromoPrice(product: BackofficeProduct): number {
    if (product.discount <= 0) return product.price;
    return product.price * (1 - product.discount / 100);
  }

  sendRow(product: BackofficeProduct): void {
    const parseResult = this.parseOperation(product.id);
    if (!parseResult.ok) {
      this.rowErrors[product.id] = parseResult.error;
      return;
    }

    this.rowErrors[product.id] = '';
    this.globalError = '';

    this.api.updateProduct(product.id, parseResult.operation).subscribe({
      next: (updated) => {
        this.products = this.products.map((p) => (p.id === updated.id ? updated : p));
        this.drafts[product.id] = this.emptyDraft();
        this.infoMessage = `Produit ${updated.name} mis a jour.`;
      },
      error: (err) => {
        this.rowErrors[product.id] = err?.message || 'Erreur backend lors de la mise a jour.';
      }
    });
  }

  sendAll(): void {
    this.globalError = '';
    this.infoMessage = '';

    const updates: Array<{ id: number; operation: StockOperationPayload }> = [];

    for (const product of this.products) {
      const parsed = this.parseOperation(product.id);
      if (!parsed.ok) {
        if (this.hasDraftData(product.id)) {
          this.rowErrors[product.id] = parsed.error;
          this.globalError = 'Corrigez les champs en rouge avant envoi global.';
        }
        continue;
      }
      this.rowErrors[product.id] = '';
      updates.push({ id: product.id, operation: parsed.operation });
    }

    if (this.globalError) return;
    if (!updates.length) {
      this.globalError = 'Aucune modification a envoyer.';
      return;
    }

    this.loading = true;
    this.api.bulkUpdate(updates).subscribe({
      next: (rows) => {
        this.products = rows;
        for (const product of this.products) {
          this.drafts[product.id] = this.emptyDraft();
        }
        this.infoMessage = `${updates.length} produit(s) mis a jour.`;
        this.loading = false;
      },
      error: (err) => {
        this.globalError = err?.message || 'Erreur backend pendant envoi global.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.auth.clearToken();
    this.router.navigate(['/backoffice/login']);
  }

  isInvalid(id: number): boolean {
    return !!this.rowErrors[id];
  }

  private loadProducts(): void {
    this.api.getProducts().subscribe({
      next: (rows) => {
        this.products = rows;
        for (const product of rows) {
          this.drafts[product.id] = this.emptyDraft();
          this.rowErrors[product.id] = '';
        }
      },
      error: () => {
        this.globalError = 'Impossible de charger les produits.';
      }
    });
  }

  private parseOperation(
    id: number
  ): { ok: true; operation: StockOperationPayload } | { ok: false; error: string } {
    const draft = this.drafts[id];
    if (!draft || !this.hasDraftData(id)) {
      return { ok: false, error: 'Saisissez type, quantite et prix unitaire.' };
    }

    if (!draft.movementType) {
      return { ok: false, error: 'Type de mouvement obligatoire.' };
    }

    const qty = Number(this.toText(draft.qty));
    if (!Number.isInteger(qty) || qty <= 0) {
      return { ok: false, error: 'Quantite: entier > 0 obligatoire.' };
    }

    const unitPrice = Number(this.toText(draft.unitPrice));
    if (Number.isNaN(unitPrice) || unitPrice < 0) {
      return { ok: false, error: 'Prix unitaire invalide.' };
    }

    if (draft.movementType === 'expired' && unitPrice !== 0) {
      return { ok: false, error: 'Invendus: prix unitaire doit etre 0.' };
    }

    if (draft.movementType !== 'expired' && unitPrice <= 0) {
      return { ok: false, error: 'Achat/vente: prix unitaire doit etre > 0.' };
    }

    const operation: StockOperationPayload = {
      type: draft.movementType,
      qty,
      unitPrice
    };

    const discountRaw = this.toText(draft.discount);
    if (discountRaw !== '') {
      const discount = Number(discountRaw);
      if (Number.isNaN(discount) || discount < 0 || discount > 100) {
        return { ok: false, error: 'Promotion: valeur entre 0 et 100.' };
      }
      operation.discount = discount;
    }

    return { ok: true, operation };
  }

  private hasDraftData(id: number): boolean {
    const draft = this.drafts[id];
    if (!draft) return false;
    return (
      this.toText(draft.qty) !== '' ||
      this.toText(draft.unitPrice) !== '' ||
      this.toText(draft.discount) !== '' ||
      !!draft.movementType
    );
  }

  private toText(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private emptyDraft(): RowDraft {
    return {
      movementType: '',
      qty: '',
      unitPrice: '',
      discount: ''
    };
  }
}
