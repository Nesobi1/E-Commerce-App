import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-management.html',
  styleUrl: './review-management.scss'
})
export class ReviewManagementComponent implements OnInit {
  reviews = signal<any[]>([]);
  loading = signal(true);
  respondingId: number | null = null;
  responseText = '';
  saving = false;
  filterSentiment = 'all';
  role = '';

  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.role = this.auth.getRole();
    this.loadReviews();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  loadReviews() {
    this.loading.set(true);
    this.http.get<any[]>(`${this.api}/reviews/manage`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => { this.reviews.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  get filteredReviews(): any[] {
    const r = this.reviews();
    if (this.filterSentiment === 'all') return r;
    return r.filter(x => x.sentiment === this.filterSentiment);
  }

  get stats() {
    const r = this.reviews();
    return {
      total: r.length,
      positive: r.filter(x => x.sentiment === 'positive').length,
      neutral:  r.filter(x => x.sentiment === 'neutral').length,
      negative: r.filter(x => x.sentiment === 'negative').length,
      responded: r.filter(x => x.response).length,
    };
  }

  openRespond(review: any) {
    this.respondingId = review.id;
    this.responseText = review.response || '';
  }

  cancelRespond() {
    this.respondingId = null;
    this.responseText = '';
  }

  saveResponse(reviewId: number) {
    if (!this.responseText.trim()) return;
    this.saving = true;

    this.http.put<any>(`${this.api}/reviews/${reviewId}/response`,
      { response: this.responseText },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (updated) => {
        this.reviews.update(list =>
          list.map(r => r.id === reviewId ? { ...r, response: updated.response } : r)
        );
        this.respondingId = null;
        this.responseText = '';
        this.saving = false;
      },
      error: () => { this.saving = false; }
    });
  }

  getStars(n: number): number[] { return Array(Math.round(n)).fill(0); }
  getInitial(email: string): string { return email ? email[0].toUpperCase() : '?'; }
}
