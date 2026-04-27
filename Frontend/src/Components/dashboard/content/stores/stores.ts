import { StoresService } from '../../../../Services/stores.service';
import { AuthService } from '../../../../Services/auth';
import { Component, OnInit, signal } from '@angular/core';
import { StoreCardComponent } from './store-card/store-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [StoreCardComponent, CommonModule],
  templateUrl: './stores.html',
  styleUrl: './stores.scss',
})
export class StoreComponent implements OnInit {
  stores = signal<any[]>([]);
  loading = signal<boolean>(true);
  isAdmin = false;

  constructor(
    private storesService: StoresService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.getRole() === 'ADMIN';
    this.storesService.getAllStores().subscribe({
      next: (data) => {
        this.stores.set(data);
        this.loading.set(false);
      }
    });
  }

  deleteStore(id: number) {
    this.storesService.deleteStore(id).subscribe(() => {
      this.stores.set(this.stores().filter(s => s.id !== id));
    });
  }
}
