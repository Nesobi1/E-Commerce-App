import { StoresService } from '../../../../Services/stores.service';
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
export class StoreComponent implements OnInit{
  stores = signal<any[]>([]);
  loading = true;

 constructor(private storesService: StoresService){}

  ngOnInit() {
    this.storesService.getAllStores().subscribe({
      next: (data) => {
        this.stores.set(data);
        this.loading = false;
        console.log('Data received:', data);
      }
    });
  }
}
