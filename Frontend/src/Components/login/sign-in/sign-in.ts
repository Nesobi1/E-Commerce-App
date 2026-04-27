import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  role: string = '';
  gender: string = '';
  errorMessage: string = '';
  shortPassword = false;
  fieldEmpty = false;
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {
      const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }

  register() {
    this.shortPassword = false;
    this.fieldEmpty = false;
    this.errorMessage = '';

    const missing = [];
    if (!this.email) missing.push('Email');
    if (!this.username) missing.push('Username');
    if (!this.password) missing.push('Password');
    if (!this.role) missing.push('Role');
    if (!this.gender) missing.push('Gender');

    if (missing.length > 0) {
      this.fieldEmpty = true;
      this.errorMessage = missing.join(', ') + ' cannot be empty';
      return;
    }

    if (this.password.length < 8) {
      this.shortPassword = true;
      return;
    }

    const body = {
      email: this.email,
      passwordHash: this.password,
      username: this.username,
      roleType: this.role,
      gender: this.gender === 'true'
    };

    this.http.post('http://localhost:8080/api/user', body).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.fieldEmpty = true;
        this.errorMessage = 'Registration failed. Email may already be in use.';
      }
    });
  }
}
