'use client';

import { useForm } from 'react-hook-form';

type LoginInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({ mode: 'onChange' });
  const onSubmit = (data: LoginInputs) => {
    console.log(data);
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
      </div>
    </>
  );
};
export default LoginPage;
