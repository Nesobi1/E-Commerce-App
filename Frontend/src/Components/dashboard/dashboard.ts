import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar';
import { NavbarComponent } from './navbar/navbar';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

}
