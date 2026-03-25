import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Slot, CreateSlotRequest } from '../../shared/models/slot.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:9090';

  constructor(private http: HttpClient) {}
  getDashboardStats(){
    return this.http.get(`${environment.apiUrl}/admin/dashboard-stats`);
  }


  getAllSlots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.api}/slots`);
  }

  createSlot(data: CreateSlotRequest) {
    return this.http.post(
      `${this.api}/admin/create-slot?interviewerId=${data.interviewerId}&dateTime=${data.dateTime}&company=${data.company}&role=${data.role}`,
      {}
    );
  }
}
