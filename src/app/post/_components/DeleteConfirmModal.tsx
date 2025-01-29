import React, { useState } from 'react';
import caution from '@/data/images/⚠️ 주의.svg';
import { fetchPostDelete } from '@/utils/api/supabase_api/home/fetchPostDelete';
import { useUserStore } from '@/store/userStore';
import { fetchResPostDelete } from '@/utils/api/supabase_api/home/fetchResPostDelete';
import ModalForm from '@/components/ModalForm';
import AlertModal from './AlertModal';
import { useModal } from '@/providers/ModalProvider';
type Props = {
  onClose: (modalId: string) => void;
};
const DeleteConfirmModal = ({ onClose }: Props) => {
  const { user } = useUserStore();
  const [showAlert, setShowAlert] = useState(false);
  const { modals, modalData } = useModal();

  if (!modals.deleteConfirm || !modalData) return null;

  const { requestpost, responsepost } = modalData;

  return (
    <>
      <ModalForm
        onClose={() => onClose('deleteConfirm')}
        imageSrc={caution}
        text1="정말 삭제하시겠어요?"
        text2="삭제 후에는 글을 복구할 수 없어요"
        buttonTxt1="취소"
        buttonTxt2="삭제"
        onYesClick={() => {
          if (requestpost) {
            fetchPostDelete(requestpost, user?.id);
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
      <AlertModal show={showAlert} message="글이 삭제되었어요" />
    </>
  );
};

export default DeleteConfirmModal;
