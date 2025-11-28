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
  selector: 'app-vue51',
  standalone: true,
  templateUrl: './vue51.page.html',
  styleUrls: ['./vue51.page.scss'],
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
export class Vue51Page implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Filtrer catégorie = 1 (Crustacés)
        this.products = data.filter((p: any) => p.category === 1);
        console.log("Catégorie 1 (Crustacés) :", this.products);
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

  /** Ajoute ou retire selon l'état */
  toggleProduct(product: any) {
    this.cartService.toggleProduct(product);
    console.log("Panier après toggle :", this.cartService.getCart());
  }

  /** Logo Home → vider panier + accueil */
  goHomeAndClear() {
    this.cartService.clearCart();
    this.router.navigate(['/home']);
  }
}
