import Image from 'next/image';
import React from 'react';
import lock from '@/data/images/🔓️ 열린 자물쇠.svg';
import { useTranslation } from 'react-i18next';
type Props = {
  onClose: () => void;
};
const LoginModal = ({ onClose }: Props) => {
  const { t } = useTranslation('home');

  return (
    <div
      className="fixed top-0 z-[52] bg-[#111111]/60 w-[375px] h-full grid items-end"
      onClick={onClose}
    >
      {/* 흰색 배경 모달 */}
      <div
        className="bg-white h-[284px] rounded-t-2xl px-6 py-4 grid place-items-center"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 모달 내용 */}
        <Image src={lock} alt="lock" width={80} height={80} />
        <div className="text-center text-black text-xl font-bold leading-loose mb-2">
          {t('login_please')}
        </div>
        <div className="text-center text-[#797c80] text-sm font-medium leading-snug">
          {t('login_subtext_1')}
          <br />
          {t('login_subtext_2')}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-4 w-full">
          <div
            className="flex-1 py-3 text-sm font-semibold text-Gray1 bg-Gray9Fill rounded-lg w-full text-center cursor-pointer"
            onClick={onClose}
          >
            {t('later')}
          </div>
          <div
            className="flex-1 py-3 text-sm font-semibold text-white bg-Blue2 rounded-lg w-[100px] text-center cursor-pointer"
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
