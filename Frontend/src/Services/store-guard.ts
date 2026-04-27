import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const storeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getRole() === 'CORPORATE') {
    router.navigate(['/dashboard/home']);
    return false;
  }
  return true;
};
