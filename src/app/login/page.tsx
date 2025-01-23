'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.

import { useTranslation } from 'next-i18next'
import Login from './_components/Login';
import { useEffect } from 'react';

const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};
export default LoginPage;
