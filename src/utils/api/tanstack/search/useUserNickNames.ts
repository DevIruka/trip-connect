import { useQuery } from "@tanstack/react-query";
import { fetchUserNicknames } from "../../supabase_api/search/fetchUserNickNames";

export const useUserNicknames = (userIds: (string | null)[]) => {
    return useQuery({
      queryKey: ['userNickname', userIds], // 첫 번째 인자: 쿼리 키 (배열)
      queryFn: () => fetchUserNicknames(userIds), // 두 번째 인자: 쿼리 함수
      enabled: userIds.length > 0, // 세 번째 인자: 옵션 객체 (userId가 있을 때만 쿼리 실행)
    });
  };