import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // On pointe maintenant vers le fichier local dans assets
  private apiUrl = 'assets/data/products.json';

  constructor(private http: HttpClient) {}

  // Récupérer toute la liste des produits depuis le bouchon JSON local
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
