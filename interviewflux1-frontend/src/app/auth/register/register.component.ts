import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush   // ✅ Fix NG0100
})
export class RegisterComponent {

  private fb      = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router  = inject(Router);
  private snack   = inject(MatSnackBar);
  private cdr     = inject(ChangeDetectorRef);

  hidePassword = true;
  loading      = false;

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.cdr.markForCheck();   // ✅ use markForCheck instead of detectChanges

    const { username, email, password } = this.registerForm.value;

    // ✅ Explicitly build payload matching backend SignupRequest fields
    const payload = {
      name:     username!,     // ✅ backend field is "name"
      email:    email!,
      password: password!
    };

    console.log('Sending payload:', payload);  // ✅ verify in console

    this.authSvc.signup(payload).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.snack.open('Account created! Please sign in.', 'Close', {
          duration: 3000,
          panelClass: ['success-snack']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Signup error:', err);   // ✅ see exact backend message

        const msg = err?.error?.message
          || err?.error?.name
          || err?.error
          || 'Registration failed. Try again.';

        this.snack.open(msg, 'Close', {
          duration: 4000,
          panelClass: ['error-snack']
        });
      }
    });
  }
}
