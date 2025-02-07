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
import { Desktop, Mobile } from '@/components/ui/Responsive';

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
        <Mobile>
          <Link href="/">
            <Image
              src={leftIcon}
              width={24}
              height={24}
              alt="back"
              className="py-[16px]"
            />
          </Link>
        </Mobile>
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full"
          >
            {step === 1 && (
              <>
                <div className="flex flex-col">
                  <Mobile>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[480px]">
                        <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
                          {t('beuser')}
                        </h2>
                      </div>
                    </div>
                  </Mobile>
                  <Desktop>
                    <div className="flex flex-col items-center mt-[105px] mb-[36px]">
                      <div className="flex flex-row items-center justify-center">
                        <h2 className="text-center text-[#44484c] text-[28px] font-bold font-['Pretendard'] leading-[44.80px]">
                          {t('beuser')}
                        </h2>
                      </div>
                    </div>
                  </Desktop>
                </div>
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[480px]">
                    <div className="flex items-start gap-[2px] mb-[8px]">
                      <label className="text-[14px] md:text-lg md:text-[#797c80] md:font-medium inline-block">
                        {t('email')}
                      </label>
                      <Image
                        src={redDot}
                        width={3}
                        height={3}
                        alt="dot"
                        className="mt-[2px]"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        id="email"
                        placeholder={t('email')}
                        className="w-full mb-[32px]"
                        {...register('email', {
                          required: '이메일을 입력해주세요.',
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        })}
                      />
                      {errors.email?.type === 'required' && (
                        <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                          {t('erroremailrequired')}
                        </span>
                      )}
                      {errors.email?.type === 'pattern' && (
                        <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                          {t('erroremailpattern')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[480px]">
                    {/* Label과 redDot 정렬 */}
                    <div className="flex items-start gap-[2px] mb-[8px]">
                      <label className="text-[14px] md:text-lg md:text-[#797c80] md:font-medium inline-block">
                        {t('password')}
                      </label>
                      <Image
                        src={redDot}
                        width={3}
                        height={3}
                        alt="dot"
                        className="mt-[2px]"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder={t('password')}
                        type="password"
                        className="w-full mb-[32px]"
                        {...register('password', {
                          required: '비밀번호를 입력해주세요.',
                          minLength: {
                            value: 6,
                            message: '비밀번호는 최소 6자 이상이여야 합니다.',
                          },
                        })}
                      />
                      {errors.password?.type === 'required' && (
                        <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                          {t('errorpwrequired')}
                        </span>
                      )}
                      {errors.password?.type === 'minLength' && (
                        <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                          {t('errorpasswordpattern')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-[480px]">
                    <div className="flex items-start gap-[2px] mb-[8px]">
                      <label className="text-[14px] md:text-lg md:text-[#797c80] md:font-medium inline-block">
                        {t('passwordcheck')}
                      </label>
                      <Image
                        src={redDot}
                        width={3}
                        height={3}
                        alt="dot"
                        className="mt-[2px]"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        id="passwordCheck"
                        placeholder={t('passwordcheck')}
                        type="password"
                        className="w-full mb-[32px]"
                        {...register('passwordCheck', {
                          required: '위의 비밀번호를 입력해주세요.',
                          validate: (value) =>
                            value === password ||
                            '비밀번호가 일치하지 않습니다.',
                        })}
                      />
                      {errors.passwordCheck && (
                        <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                          {t('errorpwsame')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <div className="flex flex-col">
                    <Mobile>
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-[480px]">
                          <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
                            {t('beuser')}
                          </h2>
                        </div>
                      </div>
                    </Mobile>
                    <Desktop>
                      <div className="flex flex-col items-center mt-[105px] mb-[36px]">
                        <div className="flex flex-row items-center justify-center">
                          <h2 className="text-center text-[#44484c] text-[28px] font-bold font-['Pretendard'] leading-[44.80px]">
                            {t('beuser')}
                          </h2>
                        </div>
                      </div>
                    </Desktop>
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full max-w-[480px]">
                        <div className="flex items-start gap-[2px] mb-[8px]">
                          <label className="text-[14px] md:text-lg md:text-[#797c80] md:font-medium inline-block">
                            {t('nickname')}
                          </label>
                          <Image
                            src={redDot}
                            width={3}
                            height={3}
                            alt="dot"
                            className="mt-[2px]"
                          />
                        </div>
                        <div className="relative">
                          <Input
                            id="nickname"
                            placeholder={t('nickname')}
                            className="w-full mb-[32px]"
                            {...register('nickname', {
                              required: '닉네임을 입력해주세요.',
                            })}
                          />
                          {errors.nickname && (
                            <span className="absolute top-[53px] md:top-[60px] left-0 text-[12px] md:text-sm text-[#FC828A] block">
                              {t('errornicknamerequired')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[480px]">
                <BlueButton
                  type="submit"
                  disabled={!isValid}
                  className="mt-[93px] mb-[40px] md:mt-[60px]"
                >
                  {step === 1 ? t('next') : t('beuser')}
                </BlueButton>
              </div>
            </div>
            {/* <div className="fixed bottom-8 w-[335px]">
              <BlueButton disabled={!isValid}>
                {step === 1 ? t('next') : t('beuser')}
              </BlueButton>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
