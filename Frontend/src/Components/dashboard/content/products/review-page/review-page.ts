import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, ReviewSubmit } from '../../../../../Services/review';
import { ProductsService } from '../../../../../Services/products.service';
import { AuthService } from '../../../../../Services/auth';

@Component({
  selector: 'app-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss'
})
export class ReviewPageComponent implements OnInit {
  product = signal<any>(null);
  reviews = signal<any[]>([]);
  loading = signal(false);
  showForm = false;
  submitting = false;
  formError = '';
  hoverRating = 0;
  isCustomer = false;
  productId = 0;
  submitSuccess = false;

  newReview: ReviewSubmit = { star_rating: 0, title: '', text: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private productsService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isCustomer = this.authService.getRole() === 'CUSTOMER';
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
    this.loadReviews();
  }

  loadProduct() {
    this.productsService.getProductById(this.productId).subscribe(d => this.product.set(d));
  }

  loadReviews() {
    this.loading.set(true);
    this.reviewService.getReviewsByProduct(this.productId).subscribe({
      next: (data) => { this.reviews.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  get avgRating(): number {
    const r = this.reviews();
    if (!r.length) return 0;
    return r.reduce((sum, x) => sum + x.starRating, 0) / r.length;
  }

  get roundedRating(): number { return Math.round(this.avgRating); }

  get sentimentCounts() {
    const r = this.reviews();
    return {
      positive: r.filter(x => x.sentiment === 'positive').length,
      neutral:  r.filter(x => x.sentiment === 'neutral').length,
      negative: r.filter(x => x.sentiment === 'negative').length,
    };
  }

  getCount(star: number): number {
    return this.reviews().filter(r => r.starRating === star).length;
  }

  getBarPercent(star: number): number {
    const total = this.reviews().length;
    return total === 0 ? 0 : (this.getCount(star) / total) * 100;
  }

  getStars(n: number): number[] { return Array(Math.round(n)).fill(0); }

  getInitial(email: string): string { return email ? email[0].toUpperCase() : '?'; }

  goBack() { this.router.navigate(['/dashboard/product', this.productId]); }

  cancelForm() {
    this.showForm = false;
    this.formError = '';
    this.newReview = { star_rating: 0, title: '', text: '' };
  }

  submitReview() {
    if (this.newReview.star_rating === 0) { this.formError = 'Please select a star rating.'; return; }
    if (!this.newReview.title.trim())     { this.formError = 'Please add a title.'; return; }
    if (!this.newReview.text.trim())      { this.formError = 'Please write your review.'; return; }

    this.submitting = true;
    this.formError = '';

    this.reviewService.submitReview(this.productId, this.newReview).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
        this.cancelForm();
        this.loadReviews();
        setTimeout(() => this.submitSuccess = false, 3000);
      },
      error: () => {
        this.submitting = false;
        this.formError = 'Failed to submit. Please try again.';
      }
    });
  }
}
