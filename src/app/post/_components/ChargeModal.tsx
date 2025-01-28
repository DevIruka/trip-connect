import ModalForm from '@/components/ModalForm';
import React from 'react';
import strong from '@/data/images/‼️ 두 개의 느낌표.svg';

const ChargeModal = ({ onClose }: { onClose: (modalId: string) => void }) => {
  return (
    <ModalForm
      onClose={() => onClose('chargeModal')}
      imageSrc={strong}
      text="앗..!"
      text1={`크레딧이 부족해요.`}
      text2="충전을 먼저 해주세요."
      buttonTxt1="취소"
      buttonTxt2="충전하러 가기"
      onYesClick={() => (window.location.href = '/mypage/credit')}
      color="bg-Blue2"
    />
  );
};

export default ChargeModal;
