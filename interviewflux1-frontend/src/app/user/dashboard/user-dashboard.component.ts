import {
  Component, inject, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { SlotService } from '../../core/services/slot.service';
import { Slot } from '../../shared/models/slot.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDashboardComponent implements OnInit {

  private slotSvc = inject(SlotService);
  private authSvc = inject(AuthService);
  private snack   = inject(MatSnackBar);
  private cdr     = inject(ChangeDetectorRef);

  availableSlots: Slot[] = [];
  myBookings: any[] = [];

  loadingSlots = false;
  loadingBookings = false;

  bookingId: number | null = null;

  activeSection = 'slots';
  sidebarCollapsed = false;

  // Booking modal
  showBookModal = false;
  selectedSlot: Slot | null = null;

  // Confirmation overlay
  showConfirmation = false;
  confirmedSlot: Slot | null = null;

  username  = this.authSvc.getUsername() ?? 'User';
  userEmail = (this.authSvc as any).getUserEmail?.() ?? '';
  userRole  = (this.authSvc as any).getRole?.() ?? 'USER';

  ngOnInit(): void {
    this.loadSlots();
    this.loadBookings();
  }

  setSection(section: string): void {
    this.activeSection = section;
    this.cdr.markForCheck();
  }

  // =========================
  // LOAD AVAILABLE SLOTS
  // =========================
  loadSlots(): void {
    this.loadingSlots = true;
    this.cdr.markForCheck();

    this.slotSvc.getAvailableSlots().subscribe({
      next: (data) => {
        this.availableSlots = data.filter(s => s.status === 'AVAILABLE');
        this.loadingSlots = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingSlots = false;
        this.cdr.markForCheck();
      }
    });
  }

  // =========================
  // LOAD MY BOOKINGS
  // =========================
  loadBookings(): void {
    this.loadingBookings = true;
    this.cdr.markForCheck();

    this.slotSvc.getMyBookings().subscribe({
      next: (data) => {
        this.myBookings = data;
        this.loadingBookings = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingBookings = false;
        this.cdr.markForCheck();
      }
    });
  }

  // =========================
  // OPEN BOOK MODAL
  // =========================
  openBookModal(slot: Slot): void {
    this.selectedSlot = slot;
    this.showBookModal = true;
    this.cdr.markForCheck();
  }

  closeBookModal(): void {
    this.showBookModal = false;
    this.selectedSlot = null;
    this.cdr.markForCheck();
  }

  // =========================
  // CONFIRM BOOKING
  // =========================
  confirmBook(): void {

    if (!this.selectedSlot) return;

    const slot = this.selectedSlot;

    this.closeBookModal();
    this.bookingId = slot.id;
    this.cdr.markForCheck();

    this.slotSvc.bookSlot(slot.id).subscribe({

      next: () => {

        this.bookingId = null;

        this.confirmedSlot = slot;
        this.showConfirmation = true;

        this.loadSlots();
        this.loadBookings();

        this.cdr.markForCheck();
      },

      error: (err) => {

        this.bookingId = null;

        let msg = 'Failed to book slot.';

        if (typeof err?.error === 'string') {
          msg = err.error;
        }
        else if (err?.error?.message) {
          msg = err.error.message;
        }

        this.snack.open(msg, 'Close', {
          duration: 4000,
          panelClass: ['error-snack']
        });

        this.cdr.markForCheck();
      }

    });

  }

  // =========================
  // CLOSE CONFIRMATION
  // =========================
  closeConfirmation(): void {
    this.showConfirmation = false;
    this.confirmedSlot = null;
    this.setSection('bookings');
  }

  // =========================
  // FORMAT TIME
  // =========================
  // =========================
// FORMAT TIME (SHORT)
// =========================
  formatTime(t: string): string {

    if (!t) return '—';

    const [datePart, timePart] = t.split('T');

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
// FORMAT TIME (LONG)
// =========================
  formatTimeLong(t: string): string {

    if (!t) return '—';

    const [datePart, timePart] = t.split('T');

    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    const monthName = months[parseInt(month) - 1];

    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    if (h === 0) h = 12;

    return `${monthName} ${day}, ${year} at ${h}:${minute} ${ampm}`;
  }

  // =========================
  // CANCEL SLOT
  // =========================
  cancelSlot(slotId: number): void {

    if (!confirm("Are you sure you want to cancel this slot?")) {
      return;
    }

    this.slotSvc.cancelSlot(slotId).subscribe({

      next: () => {

        this.snack.open("Slot cancelled successfully", "Close", {
          duration: 3000
        });

        this.loadBookings();
        this.loadSlots();
      },

      error: () => {

        this.snack.open("Failed to cancel slot", "Close", {
          duration: 3000
        });

      }

    });

  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    this.authSvc.logout();
  }

}
