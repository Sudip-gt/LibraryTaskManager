export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthUserResponse {
  user: User;
}

export interface AuthMessageResponse {
  message: string;
}

export interface AuthForm {
  name?: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}
