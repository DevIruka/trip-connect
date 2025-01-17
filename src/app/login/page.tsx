'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { login } from './action';
import { createClient } from '@/utils/supabase/client';
import { LoginInputs } from '@/types/authType';
import Input from '@/components/Input';
import Link from 'next/link';
import BlueButton from '@/components/BlueBtn';
// import BlueButton from '@/components/BlackBtn';

const googleImage = '/images/google.png';
const kakaoImage = '/images/kakao.png';
const leftIcon = '/images/ic-left.svg';

const LoginPage = () => {
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
                로그인하기
              </h2>
              <label className="text-[14px] mb-[8px]">이메일</label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder="이메일"
                  {...register('email', {
                    required: '이메일을 입력해주세요.',
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  className="mb-[16px]"
                />
                {errors.email?.type === 'required' && (
                  <span className="absolute top-[53px] left-0 text-[12px] text-red-600">
                    이메일을 입력해 주세요
                  </span>
                )}
                {errors.email?.type === 'pattern' && (
                  <span className="absolute top-[53px] left-0 text-[12px] text-red-600">
                    유효한 이메일 주소를 입력해주세요.
                  </span>
                )}
              </div>
            </div>

            <label className="text-[14px] mb-[8px]">비밀번호</label>
            <div className="relative">
              <Input
                id="password"
                placeholder="비밀번호"
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                })}
              />
              {errors.password?.type === 'required' && (
                <span className="absolute top-[53px] left-0 text-[12px] text-red-600">
                  비밀번호를 입력해 주세요
                </span>
              )}
            </div>
            <BlueButton type="submit" className="mt-[40px] mb-[40px]">
              로그인
            </BlueButton>
          </form>
          <div className="flex items-center w-full">
            <div className="flex-grow border-t border-[E5E5EC]"></div>
            <span className="mx-[8px] text-[#808080] text-[14px]">
              간편 로그인
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
              아직 회원이 아니신가요?
            </p>
            <Link
              href={'/signup'}
              className="text-[14px] text-[#45484D] underline underline-offset-[1px] ml-1 cursor-pointer"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
