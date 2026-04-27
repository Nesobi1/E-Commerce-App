import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  username: string = '';
  avatarColor: string = '';

  private colors = [
    '#e05c5c', // red
    '#e0875c', // orange
    '#d4a843', // yellow
    '#5ca65c', // green
    '#5c8fe0', // blue
    '#7c5ce0', // purple
    '#c05ce0', // violet
    '#5cb8e0', // teal
    '#e05c9a', // pink
    '#5ce0b8', // mint
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const raw = this.auth.getUsername();
    this.username = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    this.avatarColor = this.getColorFromInitial(this.username.charAt(0));
  }

  getColorFromInitial(initial: string): string {
    const index = initial.toUpperCase().charCodeAt(0) % this.colors.length;
    return this.colors[index];
  }
}
