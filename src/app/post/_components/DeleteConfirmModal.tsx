import React, { useState } from 'react';
import caution from '@/data/images/⚠️ 주의.svg';
import { useUserStore } from '@/store/userStore';
import { fetchResPostDelete } from '@/utils/api/supabase_api/home/fetchResPostDelete';
import ModalForm from '@/components/ModalForm';
import AlertModal from '../../../components/AlertModal';
import { useModal } from '@/providers/ModalProvider';
import { fetchReqPostDelete } from '@/utils/api/supabase_api/home/fetchReqPostDelete';
import { useTranslation } from 'react-i18next';

const DeleteConfirmModal = () => {
  const { user } = useUserStore();
  const [showAlert, setShowAlert] = useState(false);
  const { modals, modalData, closeModal } = useModal();
  const { t } = useTranslation('modal');

  if (!modals.deleteConfirm || !modalData) return null;

  const { requestpost, responsepost } = modalData;

  return (
    <>
      <ModalForm
        onClose={() => closeModal('deleteConfirm')}
        imageSrc={caution}
        text1={t('you_sure')}
        text2={t('no_restore')}
        buttonTxt1={t('cancel')}
        buttonTxt2={t('delete_word')}
        onYesClick={() => {
          if (requestpost) {
            fetchReqPostDelete(requestpost, user?.id);
            setShowAlert(true); // 알림 표시

            // 1.5초 후 알림 숨기기
            setTimeout(() => {
              setShowAlert(false);
            }, 1500);
          } else if (responsepost) {
            fetchResPostDelete(responsepost, user?.id);
            setShowAlert(true); // 알림 표시

            // 1.5초 후 알림 숨기기
            setTimeout(() => {
              setShowAlert(false);
            }, 1500);
          }
        }}
        color="bg-Red1"
      />
      <AlertModal show={showAlert} message={t('delete_complete')} />
    </>
  );
};

export default DeleteConfirmModal;
