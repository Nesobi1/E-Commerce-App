import { Component, OnInit, OnDestroy, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth';
import { StoresService } from '../../../../Services/stores.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  role = '';
  storeId = 0;
  userId = 0;
  loading = signal(true);
  orderHistory = signal<any[]>([]);
  stats = signal<any>({});

  @ViewChild('chart1') chart1Ref!: ElementRef;
  @ViewChild('chart2') chart2Ref!: ElementRef;
  @ViewChild('chart3') chart3Ref!: ElementRef;
  @ViewChild('chart4') chart4Ref!: ElementRef;

  private charts: Chart[] = [];
  private apiBase = 'http://localhost:8080/api/analytics';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();
    this.userId = this.authService.getUserId();
  }

  ngAfterViewInit() {
    if (this.role === 'ADMIN') {
      this.loadAdminData();
    } else if (this.role === 'CORPORATE') {
      this.storesService.getStoreByOwner(this.userId).subscribe(store => {
        this.storeId = store.id;
        this.loadCorporateData();
      });
    } else if (this.role === 'CUSTOMER') {
      this.loadCustomerData();
    }
  }

  private getChartColors() {
    const isLight = document.body.classList.contains('light');
    return {
      text: isLight ? '#1a1a1a' : '#C7C7C7',
      subtext: isLight ? '#555' : '#888',
      grid: isLight ? '#c4bfb7' : '#363837',
      line: '#6c63ff',
      lineArea: 'rgba(108,99,255,0.1)',
      linePoint: '#6c63ff',
      bars: ['#6c63ff','#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#06b6d4'],
      pie: ['#6c63ff','#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#06b6d4'],
      border: '#363837',
    };
  }

  loadAdminData() {
    this.http.get<any>(`${this.apiBase}/total-stats`).subscribe(data => {
      this.stats.set(data);
    });
    this.http.get<any[]>(`${this.apiBase}/revenue-by-month`).subscribe(data => {
      this.renderLineChart(this.chart1Ref, data.map(d => d.month), data.map(d => d.revenue), 'Revenue by Month');
    });
    this.http.get<any[]>(`${this.apiBase}/top-customers`).subscribe(data => {
      this.renderPieChart(this.chart4Ref, data.map(d => d.username), data.map(d => d.spent), 'Top Customers by Spending');
    });
    this.http.get<any[]>(`${this.apiBase}/revenue-by-store`).subscribe(data => {
      this.renderPieChart(this.chart2Ref, data.map(d => d.storeName), data.map(d => d.revenue), 'Revenue by Store');
    });
    this.http.get<any[]>(`${this.apiBase}/top-products`).subscribe(data => {
      this.renderBarChart(this.chart3Ref, data.map(d => d.productName), data.map(d => d.quantity), 'Top Products Site-wide');
      this.loading.set(false);
    });
  }

  loadCorporateData() {
    this.http.get<any>(`${this.apiBase}/store/${this.storeId}/total-stats`).subscribe(data => {
      this.stats.set(data);
    });
    this.http.get<any[]>(`${this.apiBase}/store/${this.storeId}/revenue-by-month`).subscribe(data => {
      this.renderLineChart(this.chart1Ref, data.map(d => d.month), data.map(d => d.revenue), 'Monthly Revenue');
    });
    this.http.get<any[]>(`${this.apiBase}/store/${this.storeId}/top-customers`).subscribe(data => {
      this.renderPieChart(this.chart4Ref, data.map(d => d.username), data.map(d => d.spent), 'Top Customers by Spending');
    });
    this.http.get<any[]>(`${this.apiBase}/store/${this.storeId}/orders-by-day`).subscribe(data => {
      this.renderLineChart(this.chart2Ref, data.map(d => d.date), data.map(d => d.orders), 'Orders per Day');
    });
    this.http.get<any[]>(`${this.apiBase}/store/${this.storeId}/top-products`).subscribe(data => {
      this.renderBarChart(this.chart3Ref, data.map(d => d.productName), data.map(d => d.quantity), 'Top Products in Store');
      this.loading.set(false);
    });
  }

  loadCustomerData() {
    this.http.get<any>(`${this.apiBase}/user/${this.userId}/total-stats`).subscribe(data => {
      this.stats.set(data);
    });
    this.http.get<any[]>(`${this.apiBase}/user/${this.userId}/spending-by-month`).subscribe(data => {
      this.renderLineChart(this.chart1Ref, data.map(d => d.month), data.map(d => d.spent), 'Monthly Spending');
    });
    this.http.get<any[]>(`${this.apiBase}/user/${this.userId}/spending-by-store`).subscribe(data => {
      this.renderPieChart(this.chart2Ref, data.map(d => `Store ${d.storeId}`), data.map(d => d.spent), 'Spending by Store');
    });
    this.http.get<any[]>(`${this.apiBase}/user/${this.userId}/top-products`).subscribe(data => {
      this.renderBarChart(this.chart3Ref, data.map(d => d.productName), data.map(d => d.quantity), 'Your Most Bought Products');
    });
    this.http.get<any[]>(`${this.apiBase}/user/${this.userId}/order-history`).subscribe(data => {
      this.orderHistory.set(data);
      this.loading.set(false);
    });
  }

  renderPieChart(ref: ElementRef, labels: string[], data: number[], title: string) {
    const c = this.getChartColors();
    const chart = new Chart(ref.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: c.pie,
          borderColor: c.border,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: { color: c.text, padding: 12, font: { size: 12 }, boxWidth: 14 }
          },
          title: { display: true, text: title, color: c.text, font: { size: 16 } }
        }
      }
    });
    this.charts.push(chart);
  }

  renderLineChart(ref: ElementRef, labels: string[], data: number[], title: string) {
    const c = this.getChartColors();
    const chart = new Chart(ref.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          borderColor: c.line,
          backgroundColor: c.lineArea,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: c.linePoint,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: c.text } },
          title: { display: true, text: title, color: c.text, font: { size: 16 } }
        },
        scales: {
          x: { ticks: { color: c.subtext, maxTicksLimit: 10, maxRotation: 45 }, grid: { color: c.grid } },
          y: { ticks: { color: c.subtext }, grid: { color: c.grid }, beginAtZero: true, suggestedMax: Math.max(...data) + 1 }
        }
      }
    });
    this.charts.push(chart);
  }

  renderBarChart(ref: ElementRef, labels: string[], data: number[], title: string) {
    const c = this.getChartColors();
    const chart = new Chart(ref.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Units',
          data,
          backgroundColor: c.bars,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: c.text } },
          title: { display: true, text: title, color: c.text, font: { size: 16 } }
        },
        scales: {
          x: { ticks: { color: c.subtext, maxRotation: 45 }, grid: { color: c.grid } },
          y: { ticks: { color: c.subtext }, grid: { color: c.grid }, beginAtZero: true, suggestedMax: Math.max(...data) + 1 }
        }
      }
    });
    this.charts.push(chart);
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }
}
