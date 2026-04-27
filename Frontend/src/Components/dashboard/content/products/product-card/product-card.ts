import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../../Services/cart';
import { ProductsService } from '../../../../../Services/products.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCardComponent {
  @Input() product: any;
  @Input() canManage: boolean = false;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  added = false;
  editingStock = false;
  stockValue = 0;

  constructor(
    private cartService: CartService,
    private productsService: ProductsService
  ) {}

  addToCart() {
    this.cartService.addItem(this.product);
    this.added = true;
    setTimeout(() => this.added = false, 1500);
  }

  toggleStockEdit() {
    this.stockValue = this.product.stock;
    this.editingStock = !this.editingStock;
  }

  saveStock() {
    this.productsService.updateStock(this.product.id, this.stockValue).subscribe({
      next: (updated) => {
        this.product.stock = updated.stock;
        this.editingStock = false;
      }
    });
  }
}

