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
  refresh: () => Promise<string>;
  check: (token: string) => Promise<boolean>;
  load: () => { accessToken: string | null; refreshToken: string | null };
}

const keyAccessTokenStorage = 'accessToken';
const keyRefreshTokenStorage = 'refreshToken';

export const useAuthStore = create<AuthState>((set, get) => ({
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
      localStorage.setItem(keyAccessTokenStorage, access);
      localStorage.setItem(keyRefreshTokenStorage, refresh);
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
    localStorage.removeItem(keyAccessTokenStorage);
    localStorage.removeItem(keyRefreshTokenStorage);
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('Нет refreshToken для обновления');
    }

    try {
      // Отправляем запрос на refresh-эндпоинт
      const response = await axios.post(`${config.VITE_API_URL}/api/v1/auth/refresh/`, {
        token: refreshToken,
      });

      const { access } = response.data;
      if (!access) {
        throw new Error('В ответе сервера отсутствуют новые токены');
      }

      // Обновляем store и localStorage
      set({
        accessToken: access,
        error: null,
      });
      localStorage.setItem(keyAccessTokenStorage, access);

      return access;
    } catch (err: any) {
      if (!axios.isAxiosError(err)) {
        console.error('Ошибка при refresh токена:', err);
      }
      // Если refresh тоже не прошёл, выкидываем пользователя (логаут)
      set({ accessToken: null, refreshToken: null, error: 'Сессия истекла' });
      localStorage.removeItem(keyAccessTokenStorage);
      localStorage.removeItem(keyRefreshTokenStorage);
      throw new Error('Не удалось обновить токен, пожалуйста, авторизуйтесь снова');
    }
  },

  check: async token => {
    try {
      const response = await axios.post(`${config.VITE_API_URL}/api/v1/auth/verify/`, {
        token: token,
      });
      const { verify } = response.data;

      return verify;
    } catch (err: any) {
      console.error('Ошибка при refresh токена:', err);
      throw new Error('Не удалось проверить токен');
    }
  },

  load: () => {
    const refreshToken = localStorage.getItem(keyRefreshTokenStorage);
    const accessToken = localStorage.getItem(keyAccessTokenStorage);

    const data = {
      refreshToken,
      accessToken,
    };

    set(data);
    return data;
  },
}));
