import API from '../../api/axiosInstance';
import type { AuthForm, AuthMessageResponse, AuthUserResponse } from '../../types/auth';

export const registerUser = async (
  formData: AuthForm): Promise<AuthMessageResponse> => {
  const res = await API.post<AuthMessageResponse>('/auth/register', formData);
  return res.data;
};

export const loginUser = async (
  formData: AuthForm): Promise<AuthUserResponse> => {
  const res = await API.post<AuthUserResponse>('/auth/login', formData);
  return res.data;
};

export const fetchUser = async (): Promise<AuthUserResponse> => {
  const res = await API.post<AuthUserResponse>('/auth/refresh');
  return res.data;
};