import LoginModal from '@/components/LoginModal';
import React, { createContext, useContext, useState } from 'react';

export const ModalContext = createContext({
  isOpen: false,
  onClose: () => {},
  onOpen: () => {},
});

export const useModal = () => {
  return useContext(ModalContext);
};

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, onClose, onOpen }}>
      {children}
      {isOpen && <LoginModal onClose={onClose} />}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
