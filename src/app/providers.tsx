'use client';

import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import { useUserStore } from '@/store/userStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const { queryClient } = TanstackQueryProvider();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
export default Providers;
