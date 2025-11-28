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
  selector: 'app-vue53',
  standalone: true,
  templateUrl: './vue53.page.html',
  styleUrls: ['./vue53.page.scss'],
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
export class Vue53Page implements OnInit {

  products: any[] = [];

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Filtrer les produits en promotion (sale == true)
        this.products = data.filter((p: any) => p.sale === true);
        console.log("Produits en promo :", this.products);
      },
      error: (err) => {
        console.error("Erreur API :", err);
      }
    });
  }

  /** Produit dans le panier ? */
  isInCart(product: any): boolean {
    return this.cartService.isInCart(product);
  }

  /** Ajoute ou retire selon l’état */
  toggleProduct(product: any) {
    this.cartService.toggleProduct(product);
    console.log("Panier après toggle :", this.cartService.getCart());
  }

  /** Logo Home = vider panier + retour accueil */
  goHomeAndClear() {
    this.cartService.clearCart();
    this.router.navigate(['/home']);
  }
}
