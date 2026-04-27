import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const analyticsGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getRole() === 'CUSTOMER') {
    router.navigate(['/dashboard/home']);
    return false;
  }
  return true;
};
