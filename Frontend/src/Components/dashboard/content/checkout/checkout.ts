import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../../Services/cart';
import { AuthService } from '../../../../Services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent {
  items!: any;
  loading = signal(false);
  success = signal(false);
  orderId = signal(0);

  form = {
    fullName: '',
    address: '',
    city: '',
    cardNumber: '',
    paymentMethod: 'CREDIT_CARD'
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    public router: Router
  ) {
    this.items = this.cartService.items;
  }



  getTotal(): number {
    return this.cartService.getTotal();
  }

  getGroupedByStore(): { storeId: number, items: any[] }[] {
    const map = new Map<number, any[]>();
    for (const item of this.items()) {
      if (!map.has(item.storeId)) map.set(item.storeId, []);
      map.get(item.storeId)!.push(item);
    }
    return Array.from(map.entries()).map(([storeId, items]) => ({ storeId, items }));
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, Number(quantity));
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  placeOrder() {
    if (!this.form.fullName || !this.form.address || !this.form.cardNumber) return;
    this.loading.set(true);

    const userId = this.authService.getUserId();
    const groups = this.getGroupedByStore();
    const requests = groups.map(group => ({
      userId,
      storeId: group.storeId,
      grandTotal: group.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      paymentMethod: this.form.paymentMethod,
      items: group.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.unitPrice
      }))
    }));

    let completed = 0;
    for (const req of requests) {
      this.http.post<any>('http://localhost:8080/api/orders', req).subscribe({
        next: (res) => {
          completed++;
          if (completed === requests.length) {
            this.cartService.clear();
            this.loading.set(false);
            this.success.set(true);
            this.orderId.set(res.orderId);
          }
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }
}
