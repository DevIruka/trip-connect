import LoginModal from '@/components/LoginModal';
import React, { createContext, useContext, useState } from 'react';

type ModalState = {
  [key: string]: boolean; // 각 모달의 상태를 모달 ID로 관리
};

type ModalContextType = {
  modals: ModalState;
  openModal: (modalId: string) => void;
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

  const openModal = (modalId: string) => {
    setModals((prev) => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId: string) => {
    setModals((prev) => ({ ...prev, [modalId]: false }));
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
      {modals.loginModal && <LoginModal onClose={closeModal} />}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
