export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh?: string;
}

export interface BackofficeProduct {
  id: number;
  name: string;
  category: number;
  price: number;
  unit: string;
  sale: boolean;
  discount: number;
  comments: string;
  stockQty: number;
  soldQty: number;
}

export type StockMovementType = 'add_purchase' | 'sale' | 'expired';

export type ProductCategoryKey = 'all' | 'fish' | 'seafood' | 'crustacean' | 'promotion';

export interface StockOperationPayload {
  type: StockMovementType;
  qty: number;
  unitPrice: number;
  discount?: number;
}

export interface StockMovement {
  id: string;
  productId: number;
  category: number;
  type: StockMovementType;
  qty: number;
  unitPrice: number;
  amount: number;
  occurredAt: string;
  promotion: boolean;
}

export interface RevenueKpi {
  amount: number;
  period: string;
  category: ProductCategoryKey;
}

export interface MarginTaxKpi {
  revenue: number;
  purchaseCost: number;
  margin: number;
  tax: number;
}

export interface QuarterAlert {
  quarter: string;
  margin: number;
  level: 'danger' | 'success' | 'bonus';
  message: string;
  confetti: boolean;
}
