import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import Loader from '@/components/Loader';
import { Outlet } from 'react-router';

const Home = lazy(() => import('@/components/Home'));

const LoaderWrapper = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  );
};

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
