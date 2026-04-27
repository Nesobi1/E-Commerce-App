import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  role = '';
  email = '';
  username = '';
  gender = '';
  customerProfile = signal<any>(null);

  editingAccount = false;
  savingAccount = false;
  accountError = '';
  editAccount = { username: '', gender: 'true' };

  editingProfile = false;
  savingProfile = false;
  profileError = '';
  editProfile = { age: 0, city: '' };

  showCompleteModal = false;
  savingComplete = false;
  completeError = '';
  completeForm = { age: 0, city: '', membershipType: 'Bronze' };

  showGenderModal = false;
  savingGender = false;
  genderError = '';
  selectedGender = 'true';

  private api = 'http://localhost:8080/api';

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.role     = this.auth.getRole();
    this.email    = this.auth.getEmail();
    this.username = this.auth.getUsername();
    this.gender   = this.auth.getRawGender();

    if (this.role === 'CUSTOMER') {
      this.loadCustomerProfile();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadCustomerProfile() {
    const userId = this.auth.getUserId();
    this.http.get<any>(`${this.api}/customer-profiles/${userId}`, { headers: this.getHeaders() })
      .subscribe({ next: (data) => this.customerProfile.set(data), error: () => {} });
  }

  getInitials(): string {
    return this.username
      ? this.username.split(' ').map((w: string) => w.charAt(0).toUpperCase()).join('').slice(0, 2)
      : '?';
  }

  getGenderLabel(): string {
    return this.gender === 'true' ? 'Male' : this.gender === 'false' ? 'Female' : 'Not set';
  }

  toggleEditAccount() {
    this.editingAccount = !this.editingAccount;
    this.accountError = '';
    this.editAccount = { username: this.username, gender: this.gender };
  }

  saveAccount() {
    if (!this.editAccount.username.trim()) { this.accountError = 'Username cannot be empty.'; return; }
    this.savingAccount = true;
    this.accountError = '';

    this.http.put<any>(`${this.api}/user/${this.auth.getUserId()}`,
      { username: this.editAccount.username, gender: this.editAccount.gender === 'true' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        if (res && res.token) {
          this.auth.updateToken(res.token);
          this.username = this.auth.getUsername();
          this.gender   = this.auth.getRawGender();
        }
        this.editingAccount = false;
        this.savingAccount = false;
      },
      error: (err) => {
        console.error('Save account error:', err);
        this.accountError = 'Failed to save. Please try again.';
        this.savingAccount = false;
      }
    });
  }

  toggleEditProfile() {
    this.editingProfile = !this.editingProfile;
    this.profileError = '';
    const cp = this.customerProfile();
    this.editProfile = { age: cp?.age || 0, city: cp?.city || '' };
  }

  saveProfile() {
    if (!this.editProfile.city.trim()) { this.profileError = 'City cannot be empty.'; return; }
    if (this.editProfile.age < 1)      { this.profileError = 'Please enter a valid age.'; return; }
    this.savingProfile = true;
    this.profileError = '';

    this.http.put<any>(`${this.api}/customer-profiles/${this.auth.getUserId()}`,
      { age: this.editProfile.age, city: this.editProfile.city },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {
        this.customerProfile.set(data);
        this.editingProfile = false;
        this.savingProfile = false;
      },
      error: () => {
        this.profileError = 'Failed to save. Please try again.';
        this.savingProfile = false;
      }
    });
  }

  openCompleteProfile() {
    this.completeForm = { age: 0, city: '', membershipType: 'Bronze' };
    this.completeError = '';
    this.showCompleteModal = true;
  }

  submitCompleteProfile() {
    if (!this.completeForm.city.trim()) { this.completeError = 'City cannot be empty.'; return; }
    if (this.completeForm.age < 1)      { this.completeError = 'Please enter a valid age.'; return; }
    this.savingComplete = true;
    this.completeError = '';

    this.http.post<any>(`${this.api}/customer-profiles`,
      {
        userId: this.auth.getUserId(),
        age: this.completeForm.age,
        city: this.completeForm.city,
        membershipType: this.completeForm.membershipType,
        demographic: this.getDemographic(this.completeForm.age)
      },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => {
        this.customerProfile.set(data);
        this.showCompleteModal = false;
        this.savingComplete = false;
      },
      error: () => {
        this.completeError = 'Failed to save. Please try again.';
        this.savingComplete = false;
      }
    });
  }

  openGenderPicker() {
    this.selectedGender = this.gender || 'true';
    this.genderError = '';
    this.showGenderModal = true;
  }

  saveGender() {
    this.savingGender = true;
    this.genderError = '';

    this.http.put<any>(`${this.api}/user/${this.auth.getUserId()}`,
      { username: this.username, gender: this.selectedGender === 'true' },
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        this.auth.updateToken(res.token);
        this.gender = this.auth.getRawGender();
        this.showGenderModal = false;
        this.savingGender = false;
      },
      error: () => {
        this.genderError = 'Failed to save. Please try again.';
        this.savingGender = false;
      }
    });
  }

  closeModals() {
    this.showCompleteModal = false;
    this.showGenderModal = false;
  }

  private getDemographic(age: number): string {
    if (age < 25) return 'Young Adult';
    if (age < 40) return 'Adult';
    if (age < 60) return 'Middle Aged';
    return 'Senior';
  }

  logout() { this.auth.logout(); }
}
