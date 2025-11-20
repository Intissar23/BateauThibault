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
    IonLabel
  ]
})
export class Vue50Page implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log("TOUS LES PRODUITS :", data);

        // Filtrer par category = 0 (Poissons)
        this.products = data.filter((p: any) => p.category === 0);

        console.log("Catégorie 0 (Poissons) :", this.products);
      },
      error: (err) => {
        console.error("Erreur API :", err);
      }
    });
  }

  // ➜ Fonction ajoutée pour gérer le clic sur un produit
  onProductClick(product: any) {
    console.log("Produit cliqué (Vue50) :", product);
    // Ici plus tard : this.cartService.toggleItem(product);
  }
}
