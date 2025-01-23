'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { LoginInputs } from '@/types/authType';
import Input from '@/components/Input';
import Link from 'next/link';
import BlueButton from '@/components/BlueBtn';
import { login } from '../action';
import { googleLogin, kakaoLogin } from '../_auth/oauth';
import ErrorMessage from './ErrorMessage';
import { useState } from 'react';
import WarningModal from './Warning';
import { useTranslation } from 'react-i18next';



const googleImage = '/images/google.png';
const kakaoImage = '/images/kakao.png';
const leftIcon = '/images/ic-left.svg';

const Login = () => {
  const { t } = useTranslation('login');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: 'onChange' });

  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null,
  );

  const onSubmit = async (data: LoginInputs) => {
    const response = await login(data);
    if (!response.success) {
      setErrorMessage(response.message); // 에러 메시지 상태 업데이트
    }
  };


  return (
    <>
      <div className="inner flex flex-col">
        <Link href="/">
          <Image
            src={leftIcon}
            width={24}
            height={24}
            alt="back"
            className="py-[16px]"
          />
        </Link>
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full"
          >
            <div className="flex flex-col">
              <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
                {t('login')}
              </h2>
              <label className="text-[14px] mb-[8px]">{t('email')}</label>
              <div className="relative mb-[16px]">
                <Input
                  id="email"
                  placeholder={t('email')}
                  {...register('email', {
                    required: '이메일을 입력해주세요.',
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email?.type === 'required' && (
                  <ErrorMessage>{t('erroremailrequired')}</ErrorMessage>
                )}
                {errors.email?.type === 'pattern' && (
                  <ErrorMessage>
                    {t('erroremailpattern')}
                  </ErrorMessage>
                )}
              </div>
            </div>

            <label className="text-[14px] mb-[8px]">{t('password')}</label>
            <div className="relative">
              <Input
                id="password"
                placeholder={t('password')}
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
              {errors.password?.type === 'required' && (
                <ErrorMessage>{t('errorpwrequired')}</ErrorMessage>
              )}
            </div>
            <BlueButton type="submit" className="mt-[40px] mb-[40px]">
            {t('login')}
            </BlueButton>
          </form>
          <div className="flex items-center w-full">
            <div className="flex-grow border-t border-[E5E5EC]"></div>
            <span className="mx-[8px] text-[#808080] text-[14px]">
            {t('easyLogin')}
            </span>
            <div className="flex-grow border-t border-[#D9D9D9]"></div>
          </div>
          <div className="flex flex-row mt-[16px] mb-[62.5px] gap-[20px]">
            <Image
              src={kakaoImage}
              alt="kakao icon"
              width={48}
              height={48}
              className="cursor-pointer"
              onClick={kakaoLogin}
            />
            <Image
              src={googleImage}
              alt="google icon"
              width={48}
              height={48}
              className="cursor-pointer"
              onClick={googleLogin}
            />
          </div>
          <div className="flex flex-row">
            <p className="text-[14px] text-[#505050]">
            {t('stillNot')}
            </p>
            <Link
              href={'/signup'}
              className="text-[14px] text-[#45484D] underline underline-offset-[1px] ml-1 cursor-pointer"
            >
              {t('signup')}
            </Link>
          </div>
        </div>
        {/* 에러 발생 시 모달 표시 */}
        {errorMessage && <WarningModal onClose={() => setErrorMessage(null)} />}
      </div>
    </>
  );
};
export default Login;
