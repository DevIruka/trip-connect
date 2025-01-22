'use client';

import I18nProvider from '@/providers/I18nProvider';
// import useInit from '@/hook/useInit';
import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const { fetchUser } = useUserStore();

  // useInit();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <TanstackQueryProvider>
      <I18nProvider> {children}</I18nProvider>
    </TanstackQueryProvider>
  );
};
export default Providers;
