import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Admin, CreateAdminRequest } from '../../shared/models/admin.model';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/superadmin`;

  // ✅ GET /superadmin/admins — returns List<User> as JSON
  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.base}/admins`);
  }

  // ✅ POST /superadmin/create-admin — backend returns plain String
  createAdmin(data: CreateAdminRequest): Observable<string> {
    return this.http.post(`${this.base}/create-admin`, data, {
      responseType: 'text'   // ✅ backend returns "Admin created successfully"
    });
  }

  // ✅ PUT /superadmin/block-admin/{id} — backend returns plain String
  blockAdmin(id: number): Observable<string> {
    return this.http.put(`${this.base}/block-admin/${id}`, {}, {
      responseType: 'text'   // ✅ backend returns "Admin blocked successfully"
    });
  }
}
