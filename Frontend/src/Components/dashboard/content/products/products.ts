import { ProductsService } from './../../../../Services/products.service';
import { Component, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit{
  products = signal<any[]>([]);
  loading = true;
  storeId: number = 0;
  categoryId: number = 0;
  mode = '';

 constructor(private route: ActivatedRoute, private productsService: ProductsService){}

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'];

    if (this.mode === 'store'){
      this.storeId = Number(this.route.snapshot.paramMap.get('id'));
      this.productsService.getProductsByStore(this.storeId).subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading = false;
          console.log('Data received:', data);
        }
      });
    } else if (this.mode === 'category') {
        console.log("CATEGORY MODE")
        this.route.paramMap.subscribe(params => {
        const categoryId = Number(params.get('id'));
        this.productsService.getProductsByCategory(categoryId).subscribe(data => {
          this.products.set(data);
          this.loading = false;
        });
      });
    }
  }
}
