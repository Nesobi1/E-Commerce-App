import { Component, signal, HostListener, ElementRef, ViewChild, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CartService } from '../../../Services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  searchQuery = '';
  results = signal<any>({ products: [], stores: [] });
  showDropdown = signal(false);
  dropdownStyle = signal<any>({});
  cartCount = computed(() => this.cartService.getCount());
  private searchSubject = new Subject<string>();

  @ViewChild('searchInput') searchInputRef!: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.http.get<any>(`http://localhost:8080/api/search?q=${q}`))
    ).subscribe(data => {
      this.results.set(data);
    });
  }

  onSearch() {
    if (this.searchQuery.trim().length < 2) {
      this.showDropdown.set(false);
      return;
    }
    const rect = this.searchInputRef.nativeElement.getBoundingClientRect();
    this.dropdownStyle.set({
      position: 'fixed',
      top: rect.bottom + 8 + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
    });
    this.showDropdown.set(true);
    this.searchSubject.next(this.searchQuery);
  }

  goToProduct(productId: number) {
    this.router.navigate(['/dashboard/product', productId]);
    this.closeDropdown();
  }

  goToStore(storeId: number) {
    this.router.navigate(['/dashboard/store-products', storeId]);
    this.closeDropdown();
  }

  closeDropdown() {
    this.showDropdown.set(false);
    this.searchQuery = '';
    this.results.set({ products: [], stores: [] });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.searchWrapper')) {
      this.showDropdown.set(false);
    }
  }
}
