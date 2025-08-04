import type { AuthForm, AuthResponse } from '../../types/auth';
import API from '../../api/axiosInstance';

export const registerUser = async (
  formData: AuthForm): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>('/auth/register', formData);
  return res.data;
};

export const loginUser = async (
  formData: AuthForm): Promise<AuthResponse> => {
    const res = await API.post<AuthResponse>('/auth/login', formData);
  return res.data;
};

export const fetchUser = async (): Promise<AuthResponse> => {
  const res = await API.post<AuthResponse>('/auth/refresh');
  return res.data;
};