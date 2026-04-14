import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-shop-card',
  standalone: true,
  templateUrl: './store-card.html',
  styleUrl: './store-card.scss',
  imports: [RouterLink]
})
export class StoreCardComponent {
  @Input() store: any;
}
