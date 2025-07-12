import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const loggedIn = auth.isLoggedIn || !!localStorage.getItem('userId');
  if (!loggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};