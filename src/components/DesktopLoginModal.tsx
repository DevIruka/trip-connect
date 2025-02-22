import Image from 'next/image';
import React from 'react';
import biglogo from '@/data/images/biglogo.svg';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/providers/ModalProvider';
import Link from 'next/link';
import { googleLogin, kakaoLogin } from '@/app/login/_auth/oauth';
import { useRouter } from 'next/navigation';

const mailicon = '/images/ic-mail.svg';
const kakao = '/images/kakao.svg';
const google = '/images/google.svg';
const xmark = '/images/ic-Close.svg';

const DesktopLoginModal = () => {
  const { t } = useTranslation('login');
  const { closeModal } = useModal();
  const route = useRouter();

  const handleClick = () => {
    closeModal('DesktopLogin'); // 모달 닫기
    route.push('/signup'); // 페이지 이동
  };

  return (
    <div
      className="fixed top-0 z-[52] bg-[#111111]/60 w-full h-full grid items-end md:items-center md:justify-center"
      onClick={() => closeModal('DesktopLogin')}
    >
      {/* 흰색 배경 모달 */}
      <div
        className="bg-white h-auto rounded-t-2xl p-5 grid place-items-center md:rounded-2xl md:w-[558px] md:p-8 md:gap-7 relative"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 모달 내용 */}
        <Image src={biglogo} alt="lock" width={180} height={180} />
        <Image
          src={xmark}
          alt="close"
          width={28}
          height={28}
          className="absolute top-[36px] right-[36px] cursor-pointer filter invert-[40%] brightness-[80%]"
          onClick={() => closeModal('DesktopLogin')}
        />
        {/* 버튼 영역 */}
        <div className="flex flex-col justify-center items-center gap-2 w-full mt-2 md:max-w-[426px]">
          <div
            className="flex justify-center items-center py-[13px] gap-[8px] text-base font-semibold text-black bg-white rounded-xl border border-[#dee1e5] w-full text-center cursor-pointer"
            onClick={() => (window.location.href = '/login')}
          >
            <Image src={mailicon} width={44} height={44} alt="mailicon" />
            {t('email')} {t('login')}
          </div>
          <div
            className="flex justify-center items-center py-[10px] text-base font-semibold text-black bg-[#f9db00] rounded-xl w-full text-center cursor-pointer"
            onClick={kakaoLogin}
          >
            <Image
              src={kakao}
              width={44}
              height={44}
              alt="mailicon"
              className="mr-[4px]"
            />{' '}
            KaKao {t('login')}
          </div>
          <div
            className="flex justify-center items-center py-[10px] text-base font-semibold text-black bg-white rounded-xl border border-[#dee1e5] w-full text-center cursor-pointer relative"
            onClick={googleLogin}
          >
            <Image src={google} width={44} height={44} alt="mailicon" /> Google{' '}
            {t('login')}
          </div>
          <div className="flex flex-row mt-[12px]">
            <p className="text-[#797c80] text-base font-medium leading-snug">
              {t('stillNot')}
            </p>
            <button
              className="text-[#44484c] text-base font-medium underline underline-offset-[1px] ml-1 cursor-pointer"
              onClick={handleClick}
            >
              {t('signup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLoginModal;
