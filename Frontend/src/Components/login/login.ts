import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  showPassword = false;

  constructor(private auth: AuthService) {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }

  onSubmit() {
    this.error = '';
    this.auth.login({ email: this.email, passwordHash: this.password }).subscribe({
      next: () => {},
      error: () => this.error = 'Invalid email or password'
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
