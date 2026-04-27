import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewSubmit {
  star_rating: number;
  title: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getReviewsByProduct(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/reviews/product/${productId}`);
  }

  submitReview(productId: number, review: ReviewSubmit): Observable<any> {
    return this.http.post(`${this.api}/reviews/product/${productId}`, review);
  }
}
