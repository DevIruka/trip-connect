import Image from 'next/image';
import React from 'react';
import lock from '@/data/images/🔓️ 열린 자물쇠.svg';
import { useTranslation } from 'react-i18next';
type Props = {
  onClose: (modalId: string) => void;
};
const LoginModal = ({ onClose }: Props) => {
  const { t } = useTranslation('home');

  return (
    <div
      className="fixed top-0 z-[52] bg-[#111111]/60 w-full h-full grid items-end md:items-center md:justify-center"
      onClick={() => onClose('loginModal')}
    >
      {/* 흰색 배경 모달 */}
      <div
        className="bg-white h-auto rounded-t-2xl p-5 gap-2 grid place-items-center md:rounded-2xl md:w-[686px]"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 모달 내용 */}
        <Image src={lock} alt="lock" width={80} height={80} />
        <div className="text-center text-black text-xl font-bold leading-loose">
          {t('login_please')}
        </div>
        <div className="text-center text-Gray2 text-sm font-medium leading-snug">
          {t('login_subtext_1')}
          <br />
          {t('login_subtext_2')}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center items-center gap-2 w-full mt-2">
          <div
            className="flex-1 py-[16.5px] text-base font-semibold text-Gray1 bg-Gray9Fill rounded-xl w-full text-center cursor-pointer"
            onClick={() => onClose('loginModal')}
          >
            {t('later')}
          </div>
          <div
            className="flex-1 py-[16.5px] text-base font-semibold text-white bg-Blue2 rounded-xl w-full text-center cursor-pointer"
            onClick={() => (window.location.href = '/login')}
          >
            {t('now')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
