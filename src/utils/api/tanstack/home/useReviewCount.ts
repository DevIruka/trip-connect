import { useQuery } from '@tanstack/react-query';
import { getReviewCount } from '@/utils/api/supabase_api/search/getResponseCount';

export const useReviewCount = (postId: string | number) => {
  const { data: reviewCount } = useQuery({
    queryKey: ['reviewCount', postId],
    queryFn: () => getReviewCount(postId),
    enabled: typeof postId === 'number' && !!postId,
  });

  return { reviewCount };
};
