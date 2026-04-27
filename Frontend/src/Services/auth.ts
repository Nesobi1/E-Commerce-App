import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private username = '';
  private email    = '';
  private gender   = '';
  private role     = '';
  private userId   = 0;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreSession();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload) return;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      this.logout();
      return;
    }

    this.isAuthenticated = true;
    this.email    = payload.sub      || '';
    this.userId   = payload.userId   || 0;
    this.role     = payload.role     || '';
    this.username = payload.username || 'User';
    this.gender   = payload.gender   || '';
  }

  login(credentials: { email: string; passwordHash: string }) {
    return this.http.post<any>('http://localhost:8080/api/auth/login', {
      email:        credentials.email,
      passwordHash: credentials.passwordHash
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);

        const payload = this.decodeToken(response.token);
        if (payload) {
          this.isAuthenticated = true;
          this.email    = payload.sub      || '';
          this.userId   = payload.userId   || 0;
          this.role     = payload.role     || '';
          this.username = payload.username || 'User';
          this.gender   = payload.gender   || '';
        }

        this.router.navigate(['/dashboard']);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('token');
  }

  getUsername(): string { return this.username || 'User'; }
  getEmail():    string { return this.email; }
  getRole():     string { return this.role; }
  getUserId():   number { return this.userId; }
  getGender():   string { return this.gender === 'true' ? 'Male' : 'Female'; }

  logout() {
    this.isAuthenticated = false;
    this.username = '';
    this.email    = '';
    this.gender   = '';
    this.role     = '';
    this.userId   = 0;

    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loginWithToken(token: string) {
    localStorage.setItem('token', token);
    const payload = this.decodeToken(token);
    if (payload) {
      this.isAuthenticated = true;
      this.email    = payload.sub      || '';
      this.userId   = payload.userId   || 0;
      this.role     = payload.role     || '';
      this.username = payload.username || 'User';
      this.gender   = payload.gender   || '';
    }
    this.router.navigate(['/dashboard']);
  }

  getRawGender(): string { return this.gender; }

  updateToken(token: string): void {
    localStorage.setItem('token', token);
    const payload = this.decodeToken(token);
    if (payload) {
      this.email    = payload.sub      || '';
      this.userId   = payload.userId   || 0;
      this.role     = payload.role     || '';
      this.username = payload.username || 'User';
      this.gender   = payload.gender   || '';
    }
  }
}
