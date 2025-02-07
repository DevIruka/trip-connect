import Image from 'next/image';
import React from 'react';

type ModalProps = {
  onClose: (modalId?: string) => void;
  imageSrc: string;
  text?: string;
  text1: string;
  text2: string;
  buttonTxt1: string;
  buttonTxt2: string;
  onYesClick: () => void;
  color: string;
};

const ModalForm = ({
  onClose,
  imageSrc,
  text,
  text1,
  text2,
  buttonTxt1,
  buttonTxt2,
  onYesClick,
  color,
}: ModalProps) => {
  return (
    <div
      className="fixed top-0 z-[100] bg-[#111111]/60 w-full h-full grid items-center justify-center"
      onClick={() => onClose()}
    >
      {/* 흰색 배경 모달 */}
      <div
        className="bg-white w-[335px] h-auto rounded-2xl p-5 place-items-center grid m-5 md:w-[686px] md:h-[366px] py-8 md:rounded-3xl"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 모달 내용 */}
        <Image
          src={imageSrc}
          alt={`${imageSrc}`}
          width={40}
          height={40}
          className="md:w-[120px] md:h-[120px]"
        />
        <div className="text-center text-Gray1 text-base font-semibold leading-snug mt-3 md:text-xl">
          {text}
          <br />
          {text1} <br />
          {text2}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center items-center gap-2 w-full mt-7 md:w-[400px]">
          <div
            className="flex-1 py-[16.5px] text-base font-semibold text-Gray1 bg-Gray9Fill rounded-xl w-full text-center cursor-pointer md:text-xl"
            onClick={() => onClose()}
          >
            {buttonTxt1}
          </div>
          <div
            className={`flex-1 py-[16.5px] text-base font-semibold text-white ${color} rounded-xl w-full text-center cursor-pointer md:text-xl`}
            onClick={onYesClick}
          >
            {buttonTxt2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
