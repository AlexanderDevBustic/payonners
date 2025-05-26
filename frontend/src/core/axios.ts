import axios, { type AxiosInstance } from 'axios';
import { ENV } from './env';
import { TokenService } from '../auth/auth-jwt-service';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = (): string | null => {
  return TokenService.getToken()
};

apiClient.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized: Token expired or invalid');
      TokenService.removeToken()
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default apiClient;