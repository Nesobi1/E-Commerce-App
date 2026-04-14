import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.login({ email: this.email, passwordHash: this.password }).subscribe({
      next: () => {}, // navigation happens in the service
      error: () => this.error = 'Invalid credentials'
    });
  }
}
