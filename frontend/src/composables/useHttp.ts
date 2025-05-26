import { apiClient } from '../core/axios';
import { AxiosError } from 'axios';

export const useHttp = () => {
  
  const $get = async <T>(url: string, config?: any): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      handleError(error, url);
      throw error;
    }
  };

  const $post = async <T, U>(url: string, payload: U, config?: any): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, payload, config);
      return response.data;
    } catch (error) {
      handleError(error, url, payload);
      throw error;
    }
  };

  const $put = async <T, U>(url: string, payload: U, config?: any): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, payload, config);
      return response.data;
    } catch (error) {
      handleError(error, url, payload);
      throw error;
    }
  };

  const $delete = async <T>(url: string, config?: any): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      handleError(error, url);
      throw error;
    }
  };

  const $patch = async <T, U>(url: string, payload: U, config?: any): Promise<T> => {
    try {
      const response = await apiClient.patch<T>(url, payload, config);
      return response.data;
    } catch (error) {
      handleError(error, url, payload);
      throw error;
    }
  };

  const handleError = (error: unknown, url: string, payload?: any) => {
    if (error instanceof AxiosError) {
      console.error(
        'API Error:',
        `URL: ${url}`,
        payload ? `Payload: ${JSON.stringify(payload)}` : '',
        error.response ? error.response.data : error.message
      );
    } else {
      console.error('Unknown Error:', error);
    }
  };

  return { $get, $post, $put, $delete, $patch };
};