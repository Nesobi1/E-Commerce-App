import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoresService {
  private apiUrl = 'http://localhost:8080/api/stores';

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStoreByOwner(ownerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/owner/${ownerId}`);
  }

  deleteStore(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
