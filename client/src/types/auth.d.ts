export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthForm {
  name?: string;
  email: string;
  password: string;
}
