import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent
} from '@ionic/angular/standalone';

import { ProductService } from '../services/product';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent
  ]
})
export class ProductDetailsPage implements OnInit {
  listeProduits: Product[] = [];
  produit: Product | undefined;

  constructor(
    private productsService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productsService.getProductsFromJson().subscribe({
      next: (res: Product[]) => {
        this.listeProduits = res;

        const idParam = this.route.snapshot.paramMap.get('id');
        const id = Number(idParam);
        const fallbackId = 2;

        this.produit = this.getProduit(Number.isNaN(id) ? fallbackId : id);
      },
      error: () => {
        this.listeProduits = [];
        this.produit = undefined;
      }
    });
  }

  getProduit(id: number): Product | undefined {
    return this.listeProduits.find((p) => p.id === id);
  }
}
