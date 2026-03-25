import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        authService.logout();
        snackBar.open('Session expired. Please login again.', 'Close', { duration: 3000, panelClass: ['error-snack'] });
      } else if (err.status === 403) {
        snackBar.open('Access Denied. Insufficient permissions.', 'Close', { duration: 3000, panelClass: ['error-snack'] });
        router.navigate(['/login']);
      } else {
        const message = err.error?.message || 'An error occurred';
        snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snack'] });
      }
      return throwError(() => err);
    })
  );
};
