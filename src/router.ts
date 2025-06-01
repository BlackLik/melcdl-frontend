import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import LoaderWrapper from '@/components/loader/LoaderWrapper';
import AuthMiddleware from '@/components/middlewares/AuthMiddleware';
import UnAuthMiddleware from '@/components/middlewares/UnAuthMiddleware';

const HomePage = lazy(() => import('@/components/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));
const LoginPage = lazy(() => import('@/components/pages/LoginPage'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: LoaderWrapper,
      children: [
        {
          Component: AuthMiddleware,
          children: [
            { index: true, path: '/', Component: HomePage },
            {
              path: 'results/',
              children: [
                { index: true, Component: HomePage },
                { path: 'new/', Component: HomePage },
                { path: ':id/', Component: HomePage },
              ],
            },
          ],
        },
        {
          Component: UnAuthMiddleware,
          children: [
            { path: 'login/', Component: LoginPage },
            { path: 'registration/', Component: HomePage },
          ],
        },
        { path: '*', Component: NotFoundPage },
      ],
    },
  ],
  {
    basename: '/',
  },
);
