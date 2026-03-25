// src/app/shared/models/admin.model.ts

export interface Admin {
  id: number;
  name: string;          // ✅ matches User.java field "name"
  email: string;
  status: string;        // ✅ matches User.java field "status" (ACTIVE / BLOCKED)
  role: string;
}

export interface CreateAdminRequest {
  name: string;          // ✅ matches CreateAdminRequest.java field "name"
  email: string;
  password: string;
}
