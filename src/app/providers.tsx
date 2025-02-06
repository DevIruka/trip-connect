'use client';

import I18nProvider from '@/providers/I18nProvider';
import ModalProvider from '@/providers/ModalProvider';
import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <TanstackQueryProvider>
      <I18nProvider>
        <ModalProvider>{children}</ModalProvider>
      </I18nProvider>
    </TanstackQueryProvider>
  );
};
export default Providers;
