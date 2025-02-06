import ModalForm from '@/components/ModalForm';
import React from 'react';
import strong from '@/data/images/‼️ 두 개의 느낌표.svg';
import { useModal } from '@/providers/ModalProvider';
import { useTranslation } from 'react-i18next';

const ChargeModal = () => {
  const { closeModal } = useModal();
  const { t } = useTranslation('modal');

  return (
    <ModalForm
      onClose={() => closeModal('chargeModal')}
      imageSrc={strong}
      text={t('oh')}
      text1={t('credit_lack')}
      text2={t('charge')}
      buttonTxt1={t('cancel')}
      buttonTxt2={t('goto_charge')}
      onYesClick={() => (window.location.href = '/mypage/credit')}
      color="bg-Blue2"
    />
  );
};

export default ChargeModal;
