import Image from 'next/image';
import React from 'react';
import lock from '@/data/images/🔓️ 열린 자물쇠.svg';
type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const LoginModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

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
          로그인이 필요해요
        </div>
        <div className="text-center text-[#797c80] text-sm font-medium leading-snug">
          간편하게 로그인하고 <br />
          질문과 답변을 해보세요!
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-4 w-full">
          <div
            className="flex-1 py-3 text-sm font-semibold text-Gray1 bg-Gray9Fill rounded-lg w-full text-center"
            onClick={onClose}
          >
            나중에 하기
          </div>
          <div
            className="flex-1 py-3 text-sm font-semibold text-white bg-Blue2 rounded-lg w-[100px] text-center"
            onClick={() => (window.location.href = '/login')}
          >
            로그인 하기
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
