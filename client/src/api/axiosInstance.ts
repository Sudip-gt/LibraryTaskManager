import axios from 'axios';

const defaultBaseURL = import.meta.env.PROD
  ? 'https://librarytaskmanager.onrender.com/api'
  : 'http://localhost:5000/api';

const baseURL = import.meta.env.VITE_API_BASE_URL || defaultBaseURL;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await axios.post(`${baseURL}/auth/refresh`, undefined, { withCredentials: true });
      return API(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default API;