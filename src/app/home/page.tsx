import React, { Suspense } from 'react';
import CategoryPage from './_components/categoryPage';

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
