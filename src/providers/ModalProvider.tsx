import ChargeModal from '@/app/post/_components/ChargeModal';
import DeleteConfirmModal from '@/app/post/_components/DeleteConfirmModal';
import LoginModal from '@/components/LoginModal';
import { Tables } from '@/types/supabase';
import React, { createContext, useContext, useState } from 'react';

type ModalState = {
  [key: string]: boolean; // 각 모달의 상태를 모달 ID로 관리
};

type ModalData = {
  requestpost?: Tables<'request_posts'> | null;
  responsepost?: Tables<'response_posts'> | null;
};

type ModalContextType = {
  modals: ModalState;
  modalData?: ModalData | null;
  openModal: (modalId: string, data?: ModalData | null) => void;
  closeModal: (modalId: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<ModalState>({});
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = (modalId: string, data?: ModalData | null) => {
    setModals((prev) => ({ ...prev, [modalId]: true }));
    setModalData(data || null); // 데이터가 없으면 null 설정
  };

  const closeModal = (modalId: string) => {
    setModals((prev) => ({ ...prev, [modalId]: false }));
    setModalData(null); // 데이터가 없으면 null 설정
  };

  return (
    <ModalContext.Provider value={{ modals, modalData, openModal, closeModal }}>
      {children}
      {modals.loginModal && <LoginModal onClose={closeModal} />}
      {modals.chargeModal && <ChargeModal onClose={closeModal} />}
      {modals.deleteConfirm && <DeleteConfirmModal onClose={closeModal} />}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
