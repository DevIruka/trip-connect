import { useQuery } from '@tanstack/react-query';
import { fetchBookmarks } from '../../supabase_api/home/fetchBookmarks';

// 북마크 상태 확인
export const useBookmarks = (userId: string | undefined) => {
  // 북마크 데이터 가져오기
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: () => {
      if (userId) {
        return fetchBookmarks(userId);
      }
    },
    initialData: [], // 초기 데이터 설정
    enabled: !!userId,
  });

  // 특정 게시물이 북마크되어 있는지 확인
  const isPostBookmarked = (postId: string | number) =>
    bookmarks?.some((bookmark) => bookmark.request_id === postId);

  return {
    isPostBookmarked, // 북마크 여부 확인 함수
  };
};
