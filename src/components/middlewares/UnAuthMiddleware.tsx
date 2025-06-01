import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

const UnAuthMiddleware = () => {
  const { refresh, check, load, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const func = async (refreshToken: string | null, accessToken: string | null) => {
      if (!refreshToken && !accessToken) {
        logout();
        return;
      }

      if (accessToken && (await check(accessToken))) {
        navigate('/');
        return;
      }

      if (refreshToken && (await check(refreshToken))) {
        await refresh();
        navigate('/');
        return;
      }
    };

    const { accessToken, refreshToken } = load();

    func(refreshToken, accessToken)
      .then()
      .catch(err => console.error(err));
  }, []);

  return <Outlet />;
};

export default UnAuthMiddleware;
