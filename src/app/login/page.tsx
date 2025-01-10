'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { login } from './action';
import { createClient } from '@/utils/supabase/client';
import { LoginInputs } from '@/types/authType';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import BlackButton from '@/components/BlackBtn';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

const googleImage = '/images/google.png';
const kakaoImage = '/images/kakao.png';

const LoginPage = () => {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: 'onChange' });

  const onSubmit = async (data: LoginInputs) => {
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
      <Link href="/" className="p-2">
        <IoIosArrowBack size={30} />
      </Link>
      <div className="inner flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold py-7">로그인하기</h2>
            <label className="text-xs">이메일</label>
            <Input
              id="email"
              placeholder="이메일"
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
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
          <label className="text-xs">비밀번호</label>
          <Input
            id="password"
            placeholder="비밀번호"
            type="password"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
            })}
          />
          {errors.password?.type === 'required' && (
            <span className="text-sm text-red-600">
              비밀번호를 입력해 주세요
            </span>
          )}
          <BlackButton type="submit" className="mt-3 mb-48">
            로그인
          </BlackButton>
        </form>
        <div className="flex items-center w-full pt-3">
          <div className="flex-grow border-t border-[E5E5EC]"></div>
          <span className="mx-4 text-[#808080] text-sm">간편 로그인</span>
          <div className="flex-grow border-t border-[E5E5EC]"></div>
        </div>
        <div className="flex flex-row">
          <Image
            src={kakaoImage}
            alt="kakao icon"
            width={50}
            height={50}
            className="m-2 cursor-pointer"
            onClick={kakaoLogin}
          />
          <Image
            src={googleImage}
            alt="google icon"
            width={50}
            height={50}
            className="m-2 cursor-pointer"
            onClick={googleLogin}
          />
        </div>
        <div className="flex flex-row">
          <p className="text-xs text-[#808080]">아직 회원이 아니신가요?</p>
          <Link
            href={'/signup'}
            className="text-xs text-[#808080] underline ml-1 cursor-pointer"
          >
            회원가입
          </Link>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
