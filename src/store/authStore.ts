import { create } from 'zustand';
import axios from 'axios';
import config from '@/config';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  // Метод для логина
  login: async (login, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${config.VITE_API_URL}/api/v1/auth/login/`, {
        login,
        password,
      });

      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error('В ответе сервера отсутствуют токены');
      }

      // Сохраняем токены в стор
      set({
        accessToken: access,
        refreshToken: refresh,
        isLoading: false,
        error: null,
      });

      // При необходимости, например, сохраняем в localStorage:
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    } catch (err: any) {
      console.error('Ошибка при логине:', err);

      // Если ошибка от axios, можно разобрать сообщение
      // Например, если сервер возвращает { error: 'Неверный пароль' }
      let message = 'Не удалось выполнить логин';

      if (axios.isAxiosError(err)) {
        // Если сервер вернул JSON { error: '...</>' }
        if (err.response?.status === 401) {
          message = 'Неверный логин или пароль';
        } else if (err.response?.data?.detail) {
          message = err.response.data.error;
        } else {
          // любое другое сообщение с сервера
          message = err.response?.statusText || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      set({
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  logout: () => {
    set({ accessToken: null, refreshToken: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
}));
