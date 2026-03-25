

import { Component, inject,ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private cdr     = inject(ChangeDetectorRef);

  hidePassword = true;
  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.cdr.markForCheck();
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password!}).subscribe({
      next: (res) => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snackBar.open(`Welcome back, ${res.username}!`, 'Close', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.authService.navigateByRole(res.role);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Login error:', err);
        const msg = err?.error?.message
          || err?.error
          || 'Invalid username or password.';
        this.snackBar.open(msg, 'Close', {
          duration: 4000,
          panelClass: ['error-snack']
        });
      }
    });
  }
}
