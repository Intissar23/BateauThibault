import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: any[] = [];

  constructor() {}

  addToCart(product: any) {
    const found = this.cart.find(p => p.id === product.id);

    if (found) {
      found.qty += 1;
    } else {
      this.cart.push({ ...product, qty: 1 });
    }
  }

  removeFromCart(product: any) {
    this.cart = this.cart.filter(p => p.id !== product.id);
  }

  decreaseQty(product: any) {
    const found = this.cart.find(p => p.id === product.id);

    if (found) {
      found.qty -= 1;
      if (found.qty <= 0) {
        this.removeFromCart(product);
      }
    }
  }

  /** Change directement la quantité d'un produit */
  setQty(product: any, qty: number) {
    const found = this.cart.find(p => p.id === product.id);

    if (qty <= 0) {
      // quantité 0 → on supprime
      if (found) {
        this.removeFromCart(product);
      }
      return;
    }

    if (found) {
      found.qty = qty;
    } else {
      this.cart.push({ ...product, qty });
    }
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    return this.cart.reduce((sum, p) => sum + (p.price * p.qty), 0);
  }

  clearCart() {
    this.cart = [];
  }

  /** Vrai si le produit est déjà dans le panier */
  isInCart(product: any): boolean {
    return this.cart.some(p => p.id === product.id);
  }

  /** Ajoute ou enlève selon l'état actuel */
  toggleProduct(product: any) {
    if (this.isInCart(product)) {
      this.removeFromCart(product);
    } else {
      this.addToCart(product);
    }
  }
}
