import axios from "axios";

const defaultBaseURL = import.meta.env.PROD
  ? "https://librarytaskmanager.onrender.com/api"
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseURL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;