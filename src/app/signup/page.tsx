'use client'; // 유저로부터 인풋을 받으므로, CSR이 적합하다고 생각하였습니다.
import { useForm } from 'react-hook-form';
import { signup } from '../login/action';
import { Signup } from '@/types/auth/authType';

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Signup>({ mode: 'onChange' });
  const onSubmit = async (data: Signup) => {
    await signup(data);
  };
  const password = watch('password');
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h2 className="p-5 text-xl">이메일로 가입하기</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
          <div className="flex flex-col">
            <label htmlFor=""></label>
            <input
              id="email"
              type="text"
              placeholder="이메일 주소"
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
            className="border border-black rounded-md h-8 w-64 mt-1 mb-1"
          />
          {errors.password?.type === 'required' && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
          <input
            id="passwordCheck"
            type="password"
            placeholder="비밀번호 확인"
            {...register('passwordCheck', {
              required: '위의 비밀번호를 입력해주세요.',
              validate: (value) =>
                value === password || '비밀번호가 일치하지 않습니다.',
            })}
            className="border border-black rounded-md h-8 w-64 mt-1 mb-1"
          />
          {errors.passwordCheck && (
            <span className="text-sm text-red-600">
              {errors.passwordCheck.message}
            </span>
          )}
          <input
            type="text"
            placeholder="닉네임"
            {...register('nickname', {
              required: '닉네임을 입력해주세요.',
            })}
            className="border border-black rounded-md h-8 w-64 mt-1 mb-1"
          />
          <button type="submit" className="border border-violet-900 mt-2 mb-2">
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};
export default SignupPage;
