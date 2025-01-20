'use client';

import Image from 'next/image';

import { useForm } from 'react-hook-form';
import Input from '@/components/Input';
import BlueButton from '@/components/BlueBtn';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useRouter } from 'next/navigation';

const redDot = '/images/redDot.svg';

type NicknameForm = {
  nickname: string;
};

const NickNameSetting = () => {
  const user = useUserStore((state) => state.user);
  const route = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<NicknameForm>({ mode: 'onChange' });

  const onSubmit = async ({ nickname }: { nickname: string }) => {
    await supabase
      .from('users')
      .update({
        nickname: nickname,
      })
      .eq('id', user?.id);

    route.push('/');
  };

  return (
    <>
      <div className="inner">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <h2 className="text-[20px] font-[600] mt-[22px] mb-[28px]">
              닉네임 설정
            </h2>
            <div className="relative mb-[8px]">
              <label className="text-[14px]">닉네임</label>
              <Image
                src={redDot}
                width={3}
                height={3}
                alt="dot"
                className="absolute top-0 left-[38px]"
              />
            </div>
            <Input
              id="nickname"
              placeholder="닉네임"
              {...register('nickname', {
                required: '닉네임을 입력해주세요.',
              })}
            />
            {errors.nickname && (
              <span className="text-sm text-[#FC828A]">
                {errors.nickname.message}
              </span>
            )}
          </div>
          <div className="fixed bottom-8 w-[335px]">
            <BlueButton disabled={!isValid}>가입하기</BlueButton>
          </div>
        </form>
      </div>
    </>
  );
};
export default NickNameSetting;
