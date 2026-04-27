import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../Services/categories.service';
import { AuthService } from '../../../../Services/auth';
import { StoresService } from '../../../../Services/stores.service';
import { ProductsService } from '../../../../Services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss'
})
export class CategoryProductsComponent implements OnInit {
  categoryTree = signal<any[]>([]);
  role = '';
  storeId = 0;

  constructor(
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private storesService: StoresService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();

    if (this.role === 'CORPORATE') {
      const userId = this.authService.getUserId();
      this.storesService.getStoreByOwner(userId).subscribe(store => {
        this.storeId = store.id;
        this.productsService.getProductsByStore(this.storeId).subscribe(products => {
          const categoryIds = [...new Set(products.map((p: any) => p.categoryId))];
          this.categoriesService.getAllCategories().subscribe(allCats => {
            // Include direct categories AND their parents
            const relevantIds = new Set<number>(categoryIds);
            categoryIds.forEach(id => {
              const cat = allCats.find((c: any) => c.id === id);
              if (cat?.parentId) relevantIds.add(cat.parentId);
            });
            const filtered = allCats.filter((c: any) => relevantIds.has(c.id));
            this.categoryTree.set(this.buildTree(filtered));
          });
        });
      });
    } else {
      this.categoriesService.getAllCategories().subscribe(data => {
        this.categoryTree.set(this.buildTree(data));
      });
    }
  }

  buildTree(categories: any[]): any[] {
    const map: any = {};
    const roots: any[] = [];

    categories.forEach(c => {
      map[c.id] = { ...c, children: [] };
    });

    categories.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else if (!c.parentId) {
        roots.push(map[c.id]);
      }
    });

    return roots;
  }
}
