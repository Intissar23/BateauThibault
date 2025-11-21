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
    IonLabel
  ]
})
export class Vue51Page implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Filtrer catégorie = 1 (Coquillages / Huîtres)
        this.products = data.filter((p: any) => p.category === 1);
        console.log('Catégorie 1 (Coquillages / Huîtres) :', this.products);
      },
      error: (err) => {
        console.error('Erreur API :', err);
      }
    });
  }

  // ➜ Fonction pour gérer le clic sur un produit
  onProductClick(product: any) {
    console.log("Produit cliqué (Vue51) :", product);
    // Plus tard : this.cartService.toggleItem(product);
  }
}
