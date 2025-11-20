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
    IonLabel
  ]
})
export class Vue52Page implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Catégorie 2 = Crustacés
        this.products = data.filter((p: any) => p.category === 2);
        console.log('Catégorie 2 (Crustacés) :', this.products);
      },
      error: (err) => {
        console.error('Erreur API :', err);
      }
    });
  }

  // ➜ Fonction pour gérer le clic sur un produit
  onProductClick(product: any) {
    console.log('Produit cliqué (Vue52) :', product);
    // Plus tard : this.cartService.toggleItem(product);
  }
}
