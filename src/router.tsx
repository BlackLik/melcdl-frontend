import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import LoaderWrapper from '@/components/LoaderWrapper';

const Home = lazy(() => import('@/components/Home'));


export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: LoaderWrapper,
      children: [{ index: true, Component: Home }],
    },
  ],
  {
    basename: '/',
  },
);
