import React, { Suspense } from 'react';
import Categorizing from './_components/Categorizing';
import LoadingPage from '../loading';

const Homepage = async () => {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Categorizing />
      </Suspense>
    </>
  );
};

export default Homepage;
