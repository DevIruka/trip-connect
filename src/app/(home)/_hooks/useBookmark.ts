import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';

// 북마크 상태 확인
export const useBookmarks = (userId: string) => {
  // 북마크 데이터 가져오기
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
      return bookmarks || [];
    },
    initialData: [], // 초기 데이터 설정
  });

  // 특정 게시물이 북마크되어 있는지 확인
  const isPostBookmarked = (postId: string) =>
    bookmarks?.some((bookmark) => bookmark.request_id === postId);

  return {
    isPostBookmarked, // 북마크 여부 확인 함수
  };
};

// 북마크 추가
export const addBookmark = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .insert([{ user_id: userId, request_id: postId }])
    .select();
  if (error) throw new Error(error.message);
};

// 북마크 삭제
export const deleteBookmark = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, request_id: postId });
  if (error) throw new Error(error.message);
};
