import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080/api/products';

   constructor(private http: HttpClient) {}

  getProductsByStore(storeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }

}
