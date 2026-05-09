import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../features/auth/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }

    if (status === 403) {
      toast.error("You do not have permission to do that.");
    }

    return Promise.reject(error);
  }
);
