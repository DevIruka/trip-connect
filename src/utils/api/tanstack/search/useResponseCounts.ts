import { useQueries } from '@tanstack/react-query';
import { getResponseCount } from '@/utils/api/supabase_api/search/getResponseCount';

export const useResponseCounts = (postIds: (string | number)[]) => {
  const queries = postIds.map((postId) => ({
    queryKey: ['responseCount', postId],
    queryFn: () => getResponseCount(String(postId)),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  }));

  const results = useQueries({ queries });
  return results;
};
