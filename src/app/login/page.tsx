'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { login } from './action';
import { LoginInputs } from '../common/types/authType';
import { createClient } from '@/utils/supabase/client';

const googleImage = '/images/google.png';
const kakaoImage = '/images/kakao.png';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: 'onChange' });

  const onSubmit = async (data: LoginInputs) => {
    console.log(data);
    await login(data);
  };

  const googleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  const kakaoLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h2 className="p-5 text-xl">로그인</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="이메일"
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              className="border border-black rounded-md h-8 w-64 mt-1 mb-1"
            />
            {errors.email?.type === 'required' && (
              <span className="text-sm text-red-600">
                이메일을 입력해 주세요.
              </span>
            )}
            {errors.email?.type === 'pattern' && (
              <span className="text-sm text-red-600">
                유효한 이메일 주소를 입력해주세요.
              </span>
            )}
          </div>
          <input
            type="password"
            placeholder="비밀번호"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
            })}
            className="border border-black rounded-md h-8 w-64 mt-1 mb-1"
          />
          {errors.password?.type === 'required' && (
            <span className="text-sm text-red-600">
              비밀번호를 입력해 주세요
            </span>
          )}
          <button type="submit" className="border border-violet-900 mt-2 mb-2">
            로그인
          </button>
        </form>
        <div className="flex flex-row">
          <Image
            src={googleImage}
            alt="google icon"
            width={50}
            height={50}
            className="m-2"
            onClick={googleLogin}
          />
          <Image
            src={kakaoImage}
            alt="kakao icon"
            width={50}
            height={50}
            className="m-2"
            onClick={kakaoLogin}
          />
        </div>
      </div>
    </>
  );
};
export default LoginPage;
