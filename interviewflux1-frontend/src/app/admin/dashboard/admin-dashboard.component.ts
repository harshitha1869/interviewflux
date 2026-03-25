import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';
import { Slot, CreateSlotRequest } from '../../shared/models/slot.model';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {

  private adminSvc = inject(AdminService);
  private authSvc = inject(AuthService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private adminService = inject(AdminService);

  slots: Slot[] = [];
  loading = false;
  loadingSlots = false;

  companyChart: any;
  dailyChart: any;

  activeSection = 'dashboard';
  sidebarCollapsed = false;

  username = this.authSvc.getUsername() ?? 'admin';
  role = this.authSvc.getRole() ?? 'ADMIN';

  stats: any = {};

  slotForm = this.fb.group({
    interviewerId: ['', Validators.required],
    dateTime: ['', Validators.required],
    company: ['', Validators.required],
    role: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadSlots();
    this.loadStats();
    this.loadCharts();
  }

  get availableCount(): number {
    return this.slots.filter(s => s.status === 'AVAILABLE').length;
  }

  get bookedCount(): number {
    return this.slots.filter(s => s.status === 'BOOKED').length;
  }

  setSection(section: string): void {
    this.activeSection = section;
    this.cdr.markForCheck();
  }

  // =========================
  // LOAD ALL SLOTS
  // =========================
  loadSlots(): void {

    this.loadingSlots = true;
    this.cdr.markForCheck();

    this.adminSvc.getAllSlots().subscribe({
      next: data => {
        this.slots = data;
        this.loadingSlots = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Load slots error', err);
        this.loadingSlots = false;
        this.cdr.markForCheck();
      }
    });
  }

  // =========================
  // CREATE SLOT
  // =========================
  createSlot(): void {

    if (this.slotForm.invalid) return;

    this.loading = true;

    const { interviewerId, dateTime, company, role } = this.slotForm.value;

    // ✅ FIX: do NOT convert to UTC
    const isoDate = (dateTime as string).slice(0,16);

    const request: CreateSlotRequest = {
      interviewerId: Number(interviewerId),
      dateTime: isoDate,
      company: company as string,
      role: role as string
    };

    this.adminSvc.createSlot(request).subscribe({

      next: () => {

        this.loading = false;

        this.snack.open('Slot created successfully!', 'Close', {
          duration: 3000
        });

        this.slotForm.reset();
        this.loadSlots();
        this.setSection('slots');
      },

      error: err => {

        this.loading = false;
        console.error('Create slot error', err);

        this.snack.open('Failed to create slot', 'Close', {
          duration: 4000
        });

      }

    });

  }

  // =========================
  // FORMAT SLOT TIME
  // =========================
  formatSlotTime(slotTime?: string): string {

    if (!slotTime) return '';

    const [datePart, timePart] = slotTime.split('T');

    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    const monthName = months[parseInt(month) - 1];

    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    if (h === 0) h = 12;

    return `${monthName} ${day}, ${h}:${minute} ${ampm}`;
  }

  // =========================
  // LOAD DASHBOARD STATS
  // =========================
  loadStats(): void {

    this.adminService.getDashboardStats().subscribe((res: any) => {
      this.stats = res;
    });

  }

  // =========================
  // LOAD CHARTS
  // =========================
  loadCharts() {

    this.adminService.getDashboardStats().subscribe((res: any) => {

      const companyStats = res.companyStats || [];
      const dailyStats = res.dailyBookings || [];

      const companyLabels = companyStats.map((c: any) => c[0]);
      const companyData = companyStats.map((c: any) => c[1]);

      const dailyLabels = dailyStats.map((d: any) => d[0]);
      const dailyData = dailyStats.map((d: any) => d[1]);

      setTimeout(() => {

        if (this.companyChart) this.companyChart.destroy();
        if (this.dailyChart) this.dailyChart.destroy();

        const companyCanvas = document.getElementById('companyChart') as HTMLCanvasElement;
        const dailyCanvas = document.getElementById('dailyChart') as HTMLCanvasElement;

        if (!companyCanvas || !dailyCanvas) return;

        this.companyChart = new Chart(companyCanvas, {
          type: 'bar',
          data: {
            labels: companyLabels,
            datasets: [{
              label: 'Bookings',
              data: companyData,
              backgroundColor: '#38bdf8'
            }]
          }
        });

        this.dailyChart = new Chart(dailyCanvas, {
          type: 'line',
          data: {
            labels: dailyLabels,
            datasets: [{
              label: 'Daily Bookings',
              data: dailyData,
              borderColor: '#22c55e',
              tension: 0.3
            }]
          }
        });

      }, 200);

    });

  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    this.authSvc.logout();
  }

}
