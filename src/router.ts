import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import LoaderWrapper from '@/components/loader/LoaderWrapper';
import AuthMiddleware from '@/components/middlewares/AuthMiddleware';
import UnAuthMiddleware from '@/components/middlewares/UnAuthMiddleware';

const HomePage = lazy(() => import('@/components/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));
const LoginPage = lazy(() => import('@/components/pages/LoginPage'));
const RegistrationPage = lazy(() => import('@/components/pages/RegistrationPage'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        {
          Component: UnAuthMiddleware,
          children: [
            {
              Component: LoaderWrapper,
              children: [
                { path: 'login/', Component: LoginPage },
                { path: 'registration/', Component: RegistrationPage },
              ],
            },
          ],
        },
        {
          Component: AuthMiddleware,
          children: [
            {
              path: '/',
              Component: LoaderWrapper,
              children: [
                { index: true, Component: HomePage },
                { path: ':id/', Component: HomePage },
                { path: 'new/', Component: HomePage },
              ],
            },
          ],
        },
        {
          Component: LoaderWrapper,
          children: [{ path: '*', Component: NotFoundPage }],
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);
