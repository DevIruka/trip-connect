'use client';
import { useForm } from 'react-hook-form';
import { signup } from '../login/action';
import { Signup } from '@/types/authType';
import { useState } from 'react';
import BlackButton from '@/components/BlackBtn';

const SignupPage = () => {
  const [step, setStep] = useState(1); // 현재 단계 관리
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Signup>({ mode: 'onChange' });

  const onSubmit = async (data: Signup) => {
    if (step === 1) {
      // 1단계에서 닉네임 입력 단계로 이동
      setStep(2);
    } else {
      // 최종 단계에서 회원가입 실행
      await signup(data);
    }
  };

  const password = watch('password');

  return (
    <>
      <div className="inner flex flex-col items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <h2 className="text-xl font-extrabold py-9">가입하기</h2>
                <img src="/images/email.png" alt="email" className="w-64" />
                <input
                  id="email"
                  type="text"
                  placeholder="이메일 주소"
                  {...register('email', {
                    required: '이메일을 입력해주세요.',
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                  className="border border-[E5E5EC] rounded-md h-10 w-64 mt-1 mb-1 p-2"
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
              <img src="/images/password.png" alt="password" className="w-64" />
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                {...register('password', {
                  required: '비밀번호를 입력해주세요.',
                  minLength: {
                    value: 6,
                    message: '비밀번호는 최소 6자 이상이여야 합니다.',
                  },
                })}
                className="border border-[E5E5EC] rounded-md h-10 w-64 mt-1 mb-1 p-2"
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
              <img
                src="/images/passwordCheck.png"
                alt="password check"
                className="w-64"
              />
              <input
                id="passwordCheck"
                type="password"
                placeholder="비밀번호 확인"
                {...register('passwordCheck', {
                  required: '위의 비밀번호를 입력해주세요.',
                  validate: (value) =>
                    value === password || '비밀번호가 일치하지 않습니다.',
                })}
                className="border border-[E5E5EC] rounded-md h-10 w-64 mt-1 mb-1 p-2"
              />
              {errors.passwordCheck && (
                <span className="text-sm text-red-600">
                  {errors.passwordCheck.message}
                </span>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-extrabold py-9">닉네임 입력</h2>
                  <img
                    src="/images/nickname.png"
                    alt="nickname"
                    className="w-64"
                  />
                  <input
                    id="nickname"
                    type="text"
                    placeholder="닉네임"
                    {...register('nickname', {
                      required: '닉네임을 입력해주세요.',
                    })}
                    className="border border-[E5E5EC] rounded-md h-10 w-64 mt-1 mb-1 p-2"
                  />
                  {errors.nickname && (
                    <span className="text-sm text-red-600">
                      {errors.nickname.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
          <div className="fixed bottom-8 w-[256px]">
            <BlackButton>{step === 1 ? '다음' : '회원가입 완료'}</BlackButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
