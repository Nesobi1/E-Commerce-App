import { ActivatedRoute } from '@angular/router';
import { Component, signal, OnInit } from '@angular/core';
import { ProductsService } from '../../../../../Services/products.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../../../../Services/auth';
import { Router } from '@angular/router';



Chart.register(...registerables);

@Component({
  selector: 'app-detailed-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detailed-product-card.html',
  styleUrl: './detailed-product-card.scss',
})
export class DetailedProductCardComponent implements OnInit {
  product = signal<any>(null);
  reviews = signal<any>(null);
  allRevenue: any[] = [];
  productId: number = 0;
  selectedRange = 0;
  isCustomer = false;
  private chart: Chart | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isCustomer = this.authService.getRole() === 'CUSTOMER';
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productsService.getProductById(this.productId).subscribe(data => {
      this.product.set(data);
    });

    this.productsService.getProductReviews(this.productId).subscribe(data => {
      this.reviews.set(data);
    });

    this.productsService.getProductRevenue(this.productId).subscribe(data => {
      this.allRevenue = data;
      setTimeout(() => this.renderChart(), 150);
    });
  }

  setRange(months: number) {
    this.selectedRange = months;
    this.renderChart();
  }

  getFilteredRevenue(): any[] {
    if (!this.allRevenue.length) return [];

    if (this.selectedRange === 0) {
      const sorted = [...this.allRevenue].sort((a, b) => a.month.localeCompare(b.month));
      const first = sorted[0].month;
      const now = new Date();
      const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
      return this.fillMonthRange(first, currentMonth);
    }

    const result: any[] = [];
    const now = new Date();
    for (let i = this.selectedRange - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      const found = this.allRevenue.find(r => r.month === monthKey);
      result.push({ month: monthKey, revenue: found ? found.revenue : 0 });
    }
    return result;
  }

  fillMonthRange(start: string, end: string): any[] {
    const result: any[] = [];
    const [sy, sm] = start.split('-').map(Number);
    const [ey, em] = end.split('-').map(Number);
    let y = sy, m = sm;
    while (y < ey || (y === ey && m <= em)) {
      const monthKey = y + '-' + String(m).padStart(2, '0');
      const found = this.allRevenue.find(r => r.month === monthKey);
      result.push({ month: monthKey, revenue: found ? found.revenue : 0 });
      m++;
      if (m > 12) { m = 1; y++; }
    }
    return result;
  }

  isAdjacentMonth(a: string, b: string): boolean {
    const [ay, am] = a.split('-').map(Number);
    const [by, bm] = b.split('-').map(Number);
    const totalA = ay * 12 + am;
    const totalB = by * 12 + bm;
    return Math.abs(totalA - totalB) === 1;
  }

  prevMonth(month: string): string {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  nextMonth(month: string): string {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  renderChart() {
    const filtered = this.getFilteredRevenue();
    const labels = filtered.map(r => r.month);
    const values = filtered.map(r => r.revenue);

    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Revenue ($)',
          data: values,
          backgroundColor: 'rgba(79, 70, 229, 0.6)',
          borderColor: '#4F46E5',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `Revenue: $${(ctx.parsed?.y ?? 0).toFixed(2)}`
            }
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#666',
              maxRotation: 45,
              autoSkip: true,
              maxTicksLimit: 24
            }
          },
          y: {
            min: 0,
            max: values.every(v => v === 0)
              ? 100
              : (Math.ceil(Math.max(...values) / 100) * 100) + 100,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#666',
              callback: (value: any) => '$' + value
            }
          }
        }
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getRatingCount(star: number): number {
    return this.reviews()?.ratingBreakdown?.[star] || 0;
  }

  getRatingPercent(star: number): number {
    const total = this.reviews()?.totalReviews || 0;
    if (total === 0) return 0;
    return Math.round((this.getRatingCount(star) / total) * 100);
  }

  goToReviews() {
    this.router.navigate(['/dashboard/product', this.productId, 'reviews']);
  }

}
