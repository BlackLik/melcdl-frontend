import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import LoaderWrapper from '@/components/loader/LoaderWrapper';

const HomePage = lazy(() => import('@/components/pages/HomePage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: LoaderWrapper,
      children: [
        { index: true, Component: HomePage },
        { path: 'login/', Component: HomePage },
        { path: 'registration/', Component: HomePage },
        {
          path: 'results/',
          children: [
            { index: true, Component: HomePage },
            { path: ':id/', Component: HomePage },
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
