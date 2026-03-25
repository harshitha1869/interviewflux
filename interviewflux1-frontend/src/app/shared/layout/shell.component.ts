import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  action?: () => void;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatChipsModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="logo-area">
          <img src="assets/logo.png" alt="InterviewFlux" class="logo" onerror="this.style.display='none'">
          <div class="brand-text">
            <span class="brand-name">Interview<b>Flux</b></span>
            <span class="brand-sub">Booking System</span>
          </div>
        </div>
        <mat-nav-list>
          <ng-content select="[slot=nav-items]"></ng-content>
        </mat-nav-list>
        <div class="logout-area">
          <button mat-stroked-button color="warn" (click)="logout()" class="logout-btn">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <mat-toolbar class="top-toolbar">
          <span class="toolbar-title">
            <ng-content select="[slot=page-title]"></ng-content>
          </span>
          <span class="spacer"></span>
          <div class="user-info">
            <mat-chip [color]="roleColor" selected>{{ role }}</mat-chip>
            <span class="username">{{ username }}</span>
          </div>
        </mat-toolbar>
        <div class="content-area">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 260px; background: #0d1b4b; color: white; display: flex; flex-direction: column; }
    .logo-area { padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; }
    .logo { width: 48px; height: 48px; object-fit: contain; }
    .brand-name { font-size: 18px; color: white; display: block; }
    .brand-name b { color: #00d4ff; }
    .brand-sub { font-size: 10px; color: #00d4ff; letter-spacing: 1.5px; text-transform: uppercase; display: block; }
    mat-nav-list { flex: 1; margin-top: 16px; }
    .logout-area { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn { width: 100%; }
    .top-toolbar { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.08); height: 64px; }
    .spacer { flex: 1; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .username { font-weight: 600; color: #0d1b4b; }
    .content-area { padding: 32px; background: #f5f6fa; min-height: calc(100vh - 64px); }
  `]
})
export class ShellComponent {
  private authService = inject(AuthService);
  username = this.authService.getUsername();
  role = this.authService.getRole();

  get roleColor() {
    switch (this.role) {
      case 'SUPER_ADMIN': return 'warn';
      case 'ADMIN': return 'accent';
      default: return 'primary';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
