import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { ProductService } from '../services/product';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-vue52',
  standalone: true,
  templateUrl: './vue52.page.html',
  styleUrls: ['./vue52.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon
  ]
})
export class Vue52Page implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Catégorie 2 = Coquillages / Huîtres
        this.products = data.filter((p: any) => p.category === 2);
        console.log("Catégorie 2 (Coquillages & Huîtres) :", this.products);
      },
      error: (err) => {
        console.error("Erreur API :", err);
      }
    });
  }

  /** Produit déjà dans le panier ? */
  isInCart(product: any): boolean {
    return this.cartService.isInCart(product);
  }

  /** Toggle ajouter/retirer */
  toggleProduct(product: any) {
    this.cartService.toggleProduct(product);
    console.log("Panier après toggle :", this.cartService.getCart());
  }

  /** Logo HOME : vider le panier + revenir à l’accueil */
  goHomeAndClear() {
    this.cartService.clearCart();
    this.router.navigate(['/home']);
  }
}
