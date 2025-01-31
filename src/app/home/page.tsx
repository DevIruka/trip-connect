import React, { Suspense } from 'react';
import Home from './_components/Home';
import HomeSkeleton from './_components/HomeSkeleton';

const Homepage = async () => {
  return (
    <>
      <Suspense fallback={<HomeSkeleton />}>
        <Home />
      </Suspense>
    </>
  );
};

export default Homepage;
