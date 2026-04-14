import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  imports: [RouterLink]
})
export class ProductCardComponent {
  @Input() product: any;

}

