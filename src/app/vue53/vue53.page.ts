import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product';

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
    IonLabel
  ]
})
export class Vue53Page implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Filtrer les produits en promotion
        this.products = data.filter((p: any) => p.sale === true);
        console.log('Produits en promo :', this.products);
      },
      error: (err) => {
        console.error('Erreur API :', err);
      }
    });
  }

  // ➜ Fonction pour gérer le clic sur un produit
  onProductClick(product: any) {
    console.log('Produit cliqué (Vue53) :', product);
    // Plus tard : this.cartService.toggleItem(product);
  }
}
