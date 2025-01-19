import React, { Suspense } from 'react';
import CategoryPage from './_components/categoryPage';

const Homepage = () => {
  return (
    <>
      <Suspense>
        <CategoryPage />
      </Suspense>
    </>
  );
};

export default Homepage;
