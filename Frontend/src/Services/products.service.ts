import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductsByStore(storeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/store/${storeId}`);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductsByStoreAndCategory(storeId: number, categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/store/${storeId}/category/${categoryId}`);
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getProductsByCategoryIncludingChildren(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}/all`);
  }

  getProductsByStoreAndCategoryIncludingChildren(storeId: number, categoryId: number): Observable<any[]> {
      // For corporate — filter client side from their store products
      return this.getProductsByStore(storeId);
  }
  getProductReviews(productId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/product-detail/${productId}/reviews`);
  }

  getProductRevenue(productId: number): Observable<any[]> {
      return this.http.get<any[]>(`http://localhost:8080/api/product-detail/${productId}/revenue`);
  }

  updateStock(id: number, stock: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch<any>(`${this.apiUrl}/${id}/stock`, { stock }, { headers });
  }

}
