import { Suspense } from 'react';
import Loader from './Loader';
import { Outlet } from 'react-router';

const LoaderWrapper = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Outlet />
    </Suspense>
  );
};

export default LoaderWrapper;
