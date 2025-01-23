import React, { Suspense } from 'react';
import CategoryPage from './_components/CategoryPage';


const Homepage = async () => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <CategoryPage />
      </Suspense>
    </>
  );
};

export default Homepage;
