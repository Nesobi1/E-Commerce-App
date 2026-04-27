import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: '<p style="color:#C7C7C7; text-align:center; margin-top:40vh">Signing you in...</p>'
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.auth.loginWithToken(token);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
