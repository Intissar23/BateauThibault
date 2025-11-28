import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'assets/data/products.json';

  constructor(
    private http: HttpClient,
    private toastService: ToastService   // ✅ injection du toast
  ) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
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
}
