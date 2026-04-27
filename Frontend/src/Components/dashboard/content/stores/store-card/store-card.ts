import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  templateUrl: './store-card.html',
  styleUrl: './store-card.scss',
  imports: [RouterLink, CommonModule]
})
export class StoreCardComponent {
  @Input() store: any;
  @Input() isAdmin: boolean = false;
  @Output() onDelete = new EventEmitter<number>();

  private gradients = [
    ['#3d3528', '#4e4535'],  // warm brown
    ['#28353d', '#354550'],  // muted teal
    ['#2d3828', '#3a4a35'],  // muted green
    ['#38282d', '#4a3538'],  // muted rose
    ['#2d2838', '#3a3550'],  // muted purple
    ['#383528', '#504d35'],  // muted olive
  ];

  getGradient(): string {
    const index = (this.store?.name?.charCodeAt(0) || 0) % this.gradients.length;
    const [from, to] = this.gradients[index];
    return `linear-gradient(135deg, ${from}, ${to})`;
  }

  delete(event: MouseEvent) {
    event.stopPropagation();
    if (confirm(`Delete "${this.store.name}"?`)) {
      this.onDelete.emit(this.store.id);
    }
  }
}
