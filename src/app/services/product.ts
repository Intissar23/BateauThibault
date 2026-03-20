import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'assets/data/products.json';

  constructor(
    private http: HttpClient,
    private toastService: ToastService   // ✅ injection du toast
  ) {}

  getProductsFromJson(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error("Erreur lors du chargement des produits :", err);

        // 🔥 Toast utilisateur (exigence du sujet)
        this.toastService.showError(
          "Impossible de charger les produits pour le moment."
        );

        return throwError(() => err);
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.getProductsFromJson();
  }
}
