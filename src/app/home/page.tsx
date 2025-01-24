import React, { Suspense } from 'react';
import CategoryPage from './_components/CategoryPage';
import LoadingPage from '../loading';

const Homepage = async () => {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <CategoryPage />
      </Suspense>
    </>
  );
};

export default Homepage;
