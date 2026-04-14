import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; passwordHash: string }) {
    return this.http.post<any>('http://localhost:8080/api/auth/login', {
      email: credentials.email,
      passwordHash: credentials.passwordHash
    }).pipe(
      tap(response => {
        this.isAuthenticated = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        this.router.navigate(['/dashboard']);
      })
    );
  }

  isLoggedIn(): boolean {
    console.log(this.isAuthenticated || !!localStorage.getItem('token'));
    return this.isAuthenticated || !!localStorage.getItem('token');
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
