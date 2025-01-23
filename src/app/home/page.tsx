import React, { Suspense } from 'react';
import CategoryPage from './_components/CategoryPage';

const Homepage = () => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <CategoryPage />
      </Suspense>
    </>
  );
};

export default Homepage;
