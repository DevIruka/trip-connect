import { useQuery } from '@tanstack/react-query';
import { getResponseCount } from '@/utils/api/supabase_api/search/getResponseCount';

export const useResCount = (postId: string | number) => {
  const { data: resCounts } = useQuery({
    queryKey: ['responseCount', postId],
    queryFn: () => getResponseCount(postId),
    enabled: typeof postId === 'string' && !!postId,
  });

  return { resCounts };
};
