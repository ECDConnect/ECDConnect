import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const api = (baseUrl: string, token?: string): AxiosInstance => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers,
  });

  return axiosInstance;
};
