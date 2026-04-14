import { ActivatedRoute } from '@angular/router';
import { Component, signal } from '@angular/core';
import { ProductsService } from '../../../../../Services/products.service';

@Component({
  selector: 'app-detailed-product-card',
  imports: [],
  templateUrl: './detailed-product-card.html',
  styleUrl: './detailed-product-card.scss',
})
export class DetailedProductCardComponent {
  product = signal<any>(null);
  productId: number = 0;

  constructor(private route: ActivatedRoute, private productsService: ProductsService) {}

ngOnInit() {
  this.productId = Number(this.route.snapshot.paramMap.get('id'));
  this.productsService.getProductById(this.productId).subscribe({
    next: (data) => {
      this.product.set(data);
      console.log('Data received:', data);
    }
  });
}
}
