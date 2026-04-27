import { ProductsService } from './../../../../Services/products.service';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../Services/auth';
import { StoresService } from '../../../../Services/stores.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products = signal<any[]>([]);
  loading = signal<boolean>(true);
  storeId: number = 0;
  currentCategoryId: number = 0;
  mode = '';
  role = '';
  private paramSub!: Subscription;

  showModal = false;
  editingProduct: any = null;
  modalForm = { name: '', unitPrice: 0, categoryId: 0, sku: 0 };

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private authService: AuthService,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();
    this.mode = this.route.snapshot.data['mode'];

    if (this.mode === 'store') {
      this.storeId = Number(this.route.snapshot.paramMap.get('id'));
      this.loadByStore();

    } else if (this.mode === 'category') {
      if (this.role === 'CORPORATE') {
        const userId = this.authService.getUserId();
        this.storesService.getStoreByOwner(userId).subscribe(store => {
          this.storeId = store.id;
          this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
          this.loadByCorporateCategory();

          this.paramSub = this.route.paramMap.subscribe(params => {
            const newId = Number(params.get('id'));
            if (newId !== this.currentCategoryId) {
              this.currentCategoryId = newId;
              this.loadByCorporateCategory();
            }
          });
        });
      } else {
        this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadByCategory();

        this.paramSub = this.route.paramMap.subscribe(params => {
          const newId = Number(params.get('id'));
          if (newId !== this.currentCategoryId) {
            this.currentCategoryId = newId;
            this.loadByCategory();
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  loadByStore() {
    this.loading.set(true);
    this.productsService.getProductsByStore(this.storeId).subscribe(data => {
      this.products.set(data);
      this.loading.set(false);
    });
  }

  loadByCategory() {
    this.loading.set(true);
    if (this.currentCategoryId === 0) {
      this.productsService.getAllProducts().subscribe(data => {
        this.products.set(data);
        this.loading.set(false);
      });
    } else {
      this.productsService.getProductsByCategoryIncludingChildren(
        this.currentCategoryId
      ).subscribe(data => {
        this.products.set(data);
        this.loading.set(false);
      });
    }
  }

  loadByCorporateCategory() {
    this.loading.set(true);
    if (this.currentCategoryId === 0) {
      this.productsService.getProductsByStore(this.storeId).subscribe(data => {
        this.products.set(data);
        this.loading.set(false);
      });
    } else {
      this.productsService.getProductsByCategoryIncludingChildren(
        this.currentCategoryId
      ).subscribe(data => {
        const storeProducts = data.filter((p: any) => p.storeId === this.storeId);
        this.products.set(storeProducts);
        this.loading.set(false);
      });
    }
  }

  canManage(): boolean {
    return this.role === 'CORPORATE' || this.role === 'ADMIN';
  }

  openAddModal() {
    this.editingProduct = null;
    this.modalForm = {
      name: '',
      unitPrice: 0,
      categoryId: this.currentCategoryId || 0,
      sku: 0
    };
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.editingProduct = product;
    this.modalForm = {
      name: product.name,
      unitPrice: product.unitPrice,
      categoryId: product.categoryId,
      sku: product.sku || 0
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
  }

  saveProduct() {
    const payload = {
      ...this.modalForm,
      storeId: this.storeId
    };

    if (this.editingProduct) {
      this.productsService.updateProduct(this.editingProduct.id, payload).subscribe(() => {
        this.refreshProducts();
        this.closeModal();
      });
    } else {
      this.productsService.createProduct(payload).subscribe(() => {
        this.refreshProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(product: any) {
    if (confirm(`Delete "${product.name}"?`)) {
      this.productsService.deleteProduct(product.id).subscribe(() => {
        this.products.set(this.products().filter(p => p.id !== product.id));
      });
    }
  }

  refreshProducts() {
    if (this.mode === 'store') {
      this.loadByStore();
    } else if (this.role === 'CORPORATE') {
      this.loadByCorporateCategory();
    } else {
      this.loadByCategory();
    }
  }
}
