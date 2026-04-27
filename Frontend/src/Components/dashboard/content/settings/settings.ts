import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  isDark = signal<boolean>(!document.body.classList.contains('light'));

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light');
      this.isDark.set(false);
    }
  }

  toggleTheme() {
    if (this.isDark()) {
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
      this.isDark.set(false);
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      this.isDark.set(true);
    }
  }
}
