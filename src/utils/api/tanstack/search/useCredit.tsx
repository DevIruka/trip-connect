import { useQueries } from "@tanstack/react-query";
import { getCredit } from "../../supabase_api/search/getCredit";

export const useCredit = (postIds: (string | undefined)[]) => {
    const queries = postIds.map((postId) => ({
      queryKey: ['requestCredit', postId],
      queryFn: () => getCredit(postId),
      enabled: !!postId, // postId가 있을 때만 쿼리 실행
    }));
  
    const results = useQueries({ queries });
    return results;
  };