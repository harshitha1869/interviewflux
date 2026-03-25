import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { SuperAdminService } from '../../core/services/superadmin.service';
import { Admin } from '../../shared/models/admin.model';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrl: './superadmin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminDashboardComponent implements OnInit {
  private superAdminSvc = inject(SuperAdminService);
  private authSvc       = inject(AuthService);
  private snack         = inject(MatSnackBar);
  private fb            = inject(FormBuilder);
  private cdr           = inject(ChangeDetectorRef);

  admins: Admin[]   = [];
  loading           = false;
  loadingAdmins     = false;
  activeSection     = 'dashboard';
  sidebarCollapsed  = false;
  hidePassword      = true;

  username = this.authSvc.getUsername() ?? 'superadmin';
  role     = this.authSvc.getRole() ?? 'SUPER_ADMIN';

  createAdminForm = this.fb.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // ✅ uses status field from backend User.java
  get blockedCount(): number {
    return this.admins.filter(a => a.status === 'BLOCKED').length;
  }

  get activeCount(): number {
    return this.admins.filter(a => a.status === 'ACTIVE').length;
  }

  ngOnInit(): void { this.loadAdmins(); }

  setSection(s: string): void {
    this.activeSection = s;
    this.cdr.markForCheck();
  }

  loadAdmins(): void {
    this.loadingAdmins = true;
    this.cdr.markForCheck();
    this.superAdminSvc.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.loadingAdmins = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loadingAdmins = false;
        console.error('Load admins error:', err);
        this.cdr.markForCheck();
      }
    });
  }

  createAdmin(): void {
    if (this.createAdminForm.invalid) return;
    this.loading = true;
    this.cdr.markForCheck();

    // ✅ { name, email, password } matches CreateAdminRequest.java exactly
    const payload = {
      name:     this.createAdminForm.value.name!,
      email:    this.createAdminForm.value.email!,
      password: this.createAdminForm.value.password!
    };

    this.superAdminSvc.createAdmin(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Admin created successfully!', 'Close', {
          duration: 3000, panelClass: ['success-snack']
        });
        this.createAdminForm.reset();
        this.loadAdmins();
        this.setSection('admins');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.error('Create admin error:', err);
        const msg = err?.error?.message || err?.error || 'Failed to create admin.';
        this.snack.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
        this.cdr.markForCheck();
      }
    });
  }

  blockAdmin(id: number): void {
    this.superAdminSvc.blockAdmin(id).subscribe({
      next: () => {
        this.snack.open('Admin blocked successfully.', 'Close', {
          duration: 3000, panelClass: ['success-snack']
        });
        this.loadAdmins();
      },
      error: (err) => {
        console.error('Block admin error:', err);
        const msg = err?.error?.message || err?.error || 'Failed to block admin.';
        this.snack.open(msg, 'Close', { duration: 4000, panelClass: ['error-snack'] });
      }
    });
  }

  logout(): void { this.authSvc.logout(); }
}
