'use client';

import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import {
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  const { queryClient } = TanstackQueryProvider();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
export default Providers;
