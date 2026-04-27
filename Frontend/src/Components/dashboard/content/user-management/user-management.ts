import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../Services/auth';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagementComponent implements OnInit {
  users = signal<any[]>([]);
  loading = signal(true);
  filterRole = 'ALL';
  confirmDeleteId: number | null = null;

  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() { this.loadUsers(); }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  loadUsers() {
    this.loading.set(true);
    this.http.get<any[]>(`${this.api}/user`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => { this.users.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  get filteredUsers(): any[] {
    const u = this.users();
    if (this.filterRole === 'ALL') return u;
    return u.filter(x => x.roleType === this.filterRole);
  }

  get stats() {
    const u = this.users();
    return {
      total:      u.length,
      customers:  u.filter(x => x.roleType === 'CUSTOMER').length,
      corporate:  u.filter(x => x.roleType === 'CORPORATE').length,
      admins:     u.filter(x => x.roleType === 'ADMIN').length,
      suspended:  u.filter(x => x.suspended).length,
    };
  }

  toggleSuspend(user: any) {
    this.http.patch<any>(`${this.api}/user/${user.id}/suspend`, {},
      { headers: this.getHeaders() }
    ).subscribe({
      next: (updated) => {
        this.users.update(list =>
          list.map(u => u.id === updated.id ? updated : u)
        );
      }
    });
  }

  confirmDelete(id: number) { this.confirmDeleteId = id; }
  cancelDelete() { this.confirmDeleteId = null; }

  deleteUser(id: number) {
    this.http.delete(`${this.api}/user/${id}`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u.id !== id));
          this.confirmDeleteId = null;
        }
      });
  }

  getInitial(username: string): string {
    return username ? username[0].toUpperCase() : '?';
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'ADMIN') return 'badgeAdmin';
    if (role === 'CORPORATE') return 'badgeCorporate';
    return 'badgeCustomer';
  }
}
