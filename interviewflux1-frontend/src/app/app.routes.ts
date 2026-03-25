import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'superadmin-dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'SUPER_ADMIN' },
    loadComponent: () => import('./superadmin/dashboard/superadmin-dashboard.component').then(m => m.SuperadminDashboardComponent)
  },
  {
    path: 'admin-dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'user-dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'USER' },
    loadComponent: () => import('./user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
  },
  { path: '**', redirectTo: '' }
];
