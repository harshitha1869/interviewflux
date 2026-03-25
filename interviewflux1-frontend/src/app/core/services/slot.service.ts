import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Slot, Booking } from '../../shared/models/slot.model';

@Injectable({ providedIn: 'root' })
export class SlotService {

  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/slots`;

  getAvailableSlots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(this.base);
  }

  bookSlot(id: number): Observable<string> {
    return this.http.post(`${this.base}/book/${id}`, {}, { responseType: 'text' });
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/my-bookings`);
  }

  // ✅ FIXED
  cancelSlot(slotId: number): Observable<string> {
    return this.http.delete(`${this.base}/cancel/${slotId}`, { responseType: 'text' });
  }

  createSlot(interviewerId: number, dateTime: string, company: string, role: string) {
    return this.http.post(`${environment.apiUrl}/admin/create-slot`, null, {
      params: {
        interviewerId,
        dateTime,
        company,
        role
      }
    });
  }

}
