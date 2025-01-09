import { QueryCache, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const TanstackQueryProvider = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            alert(`ERROR: ${query.queryKey}: ${error.message}`);
          },
        }),
      }),
  );
  return { queryClient };
};
export default TanstackQueryProvider;
