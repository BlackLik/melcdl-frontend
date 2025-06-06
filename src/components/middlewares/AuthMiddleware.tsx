import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

const AuthMiddleware = () => {
  const { refresh, check, load, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const func = async (refreshToken: string | null, accessToken: string | null) => {
      if (accessToken && (await check(accessToken))) {
        return;
      }

      if (!refreshToken || !(await check(refreshToken))) {
        logout();
        navigate('/login/');
        return;
      }

      if (!accessToken) {
        await refresh();
        return;
      }

      if (!(await check(accessToken))) {
        logout();
        navigate('/login/');
        return;
      }
    };

    const { accessToken, refreshToken } = load();

    func(refreshToken, accessToken)
      .then()
      .catch(err => console.error(err));
  }, [refresh, check, load, logout]);

  return <Outlet />;
};

export default AuthMiddleware;
