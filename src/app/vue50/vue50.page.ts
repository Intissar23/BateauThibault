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
  selector: 'app-vue50',
  standalone: true,
  templateUrl: './vue50.page.html',
  styleUrls: ['./vue50.page.scss'],
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
export class Vue50Page implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('TOUS LES PRODUITS :', data);

        // Filtrer par category = 0 (Poissons)
        this.products = data.filter((p: any) => p.category === 0);

        console.log('Catégorie 0 (Poissons) :', this.products);
      },
      error: (err) => {
        console.error('Erreur API :', err);
      }
    });
  }

  /** Vrai si le produit est déjà dans le panier */
  isInCart(product: any): boolean {
    return this.cartService.isInCart(product);
  }

  /** Ajoute ou enlève le produit du panier selon son état */
  toggleProduct(product: any) {
    this.cartService.toggleProduct(product);
    console.log('Panier après toggle :', this.cartService.getCart());
  }

  /** Bouton Home dans le header : vide le panier et retourne à l’accueil */
  goHomeAndClear() {
    this.cartService.clearCart();
    this.router.navigate(['/home']);
  }
}
