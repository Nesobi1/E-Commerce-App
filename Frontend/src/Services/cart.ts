import { Injectable, signal } from '@angular/core';

export interface CartItem {
  productId: number;
  name: string;
  unitPrice: number;
  storeId: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart';
  items = signal<CartItem[]>(this.loadFromStorage());

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addItem(product: any) {
    const current = this.items();
    const existing = current.find(i => i.productId === product.id);
    if (existing) {
      this.items.set(current.map(i =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      this.items.set([...current, {
        productId: product.id,
        name: product.name,
        unitPrice: product.unitPrice,
        storeId: product.storeId,
        quantity: 1
      }]);
    }
    this.save();
  }

  removeItem(productId: number) {
    this.items.set(this.items().filter(i => i.productId !== productId));
    this.save();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) { this.removeItem(productId); return; }
    this.items.set(this.items().map(i =>
      i.productId === productId ? { ...i, quantity } : i
    ));
    this.save();
  }

  clear() {
    this.items.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTotal(): number {
    return this.items().reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  }

  getCount(): number {
    return this.items().reduce((sum, i) => sum + i.quantity, 0);
  }
}
