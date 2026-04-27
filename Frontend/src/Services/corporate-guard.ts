import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const corporateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();
  if (role === 'CORPORATE' || role === 'ADMIN') {
    return true;
  }

  router.navigate(['/dashboard/home']);
  return false;
};
