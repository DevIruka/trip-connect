'use client';
import { useForm } from 'react-hook-form';
import { signup } from '../login/action';
import { Signup } from '@/types/authType';
import { useState } from 'react';
import Input from '@/components/Input';
import Link from 'next/link';
import BlueButton from '@/components/BlueBtn';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const leftIcon = '/images/ic-left.svg';
const redDot = '/images/redDot.svg';

const SignupPage = () => {
  const { t } = useTranslation('signup');
  const [step, setStep] = useState(1); // 현재 단계 관리
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
        >
          {step === 1 && (
            <>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
                  {t('beuser')}
                </h2>
                <div className="relative mb-[8px] flex items-start gap-[2px]">
                  <label className="text-[14px] inline-block">{t('email')}</label>
                  <Image
                    src={redDot}
                    width={3}
                    height={3}
                    alt="dot"
                  />
                </div>
                <div className="relative">
                  <Input
                    id="email"
                    placeholder={t('email')}
                    {...register('email', {
                      required: '이메일을 입력해주세요.',
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    className="mb-[32px]"
                  />
                  {errors.email?.type === 'required' && (
                    <span className="absolute top-[53px] left-0 text-[12px] text-[#FC828A]">
                      {t('erroremailrequired')}
                    </span>
                  )}
                  {errors.email?.type === 'pattern' && (
                    <span className="absolute top-[53px] left-0 text-[12px] text-[#FC828A]">
                      {t('erroremailpattern')}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative mb-[8px] flex items-start gap-[2px]">
                <label className="text-[14px]">{t('password')}</label>
                <Image
                  src={redDot}
                  width={3}
                  height={3}
                  alt="dot"
                />
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder={t('password')}
                  type="password"
                  {...register('password', {
                    required: '비밀번호를 입력해주세요.',
                    minLength: {
                      value: 6,
                      message: '비밀번호는 최소 6자 이상이여야 합니다.',
                    },
                  })}
                  className="mb-[32px]"
                />
                {errors.password?.type === 'required' && (
                  <span className="absolute top-[53px] left-0 text-[12px] text-[#FC828A]">
                    {t('errorpwrequired')}
                  </span>
                )}
                {errors.password?.type === 'minLength' && (
                  <span className="absolute top-[53px] left-0 text-[12px] text-[#FC828A]">
                    {t('errorpasswordpattern')}
                  </span>
                )}
              </div>
              <div className="relative mb-[8px] flex items-start gap-[2px]">
                <label className="text-[14px]">{t('passwordcheck')}</label>
                <Image
                  src={redDot}
                  width={3}
                  height={3}
                  alt="dot"
                />
              </div>
              <div className="relative">
                <Input
                  id="passwordCheck"
                  placeholder={t('passwordcheck')}
                  type="password"
                  {...register('passwordCheck', {
                    required: '위의 비밀번호를 입력해주세요.',
                    validate: (value) =>
                      value === password || '비밀번호가 일치하지 않습니다.',
                  })}
                />
                {errors.passwordCheck && (
                  <span className="absolute top-[53px] left-0 text-[12px] text-[#FC828A]">
                    {t('errorpwsame')}
                  </span>
                )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <div className="flex flex-col">
                  <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
                  {t('beuser')}
                  </h2>
                  <div className="relative mb-[8px] flex items-start gap-[2px]">
                    <label className="text-[14px]">{t('nickname')}</label>
                    <Image
                      src={redDot}
                      width={3}
                      height={3}
                      alt="dot"
                    />
                  </div>
                  <Input
                    id="nickname"
                    placeholder={t('nickname')}
                    {...register('nickname', {
                      required: '닉네임을 입력해주세요.',
                    })}
                  />
                  {errors.nickname && (
                    <span className="text-sm text-[#FC828A]">
                      {t('errornicknamerequired')}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
          <div className="fixed bottom-8 w-[335px]">
            <BlueButton disabled={!isValid}>
            {step === 1 ? t('next') : t('beuser')}
            </BlueButton>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
