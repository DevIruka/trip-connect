import { useQueries } from '@tanstack/react-query';
import { getResponseCount, getReviewCount } from '@/utils/api/supabase_api/search/getResponseCount';

export const useResponseCounts = (postIds: (string | number)[]) => {
  const queries = postIds.map((postId) => ({
    queryKey: ['responseCount', postId],
    queryFn: () => getResponseCount(postId),
    enabled: typeof postId === 'string' && !!postId,
  }));

  const results = useQueries({ queries });
  return results;
};

export const useReviewCounts = (postIds: (string | number)[]) => {
  const queries = postIds.map((postId) => ({
    queryKey: ['reviewCount', postId],
    queryFn: () => getReviewCount(postId),
    enabled: typeof postId === 'number' && !!postId,
  }));

  const results = useQueries({ queries });
  return results;
};
