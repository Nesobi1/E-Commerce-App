import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../Services/categories.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss'
})
export class CategoryProductsComponent implements OnInit {
  categories = signal<any[]>([]);

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit() {
    this.categoriesService.getAllCategories().subscribe(data => {
      this.categories.set(data);
    });
  }
}
