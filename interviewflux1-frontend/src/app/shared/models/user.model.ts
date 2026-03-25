export interface User {
  id?: number;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  blocked?: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}
