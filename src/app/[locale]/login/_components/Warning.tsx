import Image from 'next/image';
import React from 'react';

const warning = '/images/warning.svg';

type ModalProps = {
  onClose: () => void;
};

const WarningModal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[335px] h-[212px] bg-white rounded-2xl flex-col items-center inline-flex overflow-hidden">
        <div className="h-24 flex-col justify-start items-center inline-flex mt-[20px]">
          <Image src={warning} width={40} height={40} alt="warning" />
          <div className="mt-[12px] text-center text-[#44484c] text-base font-semibold font-['Pretendard'] leading-snug">
            로그인에 실패하였습니다.
            <br />
            아이디나 비밀번호를 다시 확인해주세요.
          </div>
        </div>
        <div className="py-[20px]">
          <button
            onClick={onClose}
            className="h-[52px] w-[163.5px] bg-[#0582ff] rounded-xl justify-center items-center inline-flex"
          >
            <div className="text-white text-base font-semibold font-['Pretendard']">
              확인
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
