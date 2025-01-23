import React, { Suspense } from 'react';
import initTranslation from '@/config/server/i18n'
import CategoryPage from './_components/CategoryPage';


const Homepage = async () => {
  const { t } = await initTranslation('ko', ['login']);
  return (
    <>
    <div>{t('login')}</div>
      <Suspense fallback={<div>loading...</div>}>
        <CategoryPage />
      </Suspense>
    </>
  );
};

export default Homepage;
