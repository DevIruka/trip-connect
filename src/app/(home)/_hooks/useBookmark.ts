import { supabase } from '@/utils/supabase/supabaseClient';

// 북마크 상태 확인
export const isBookmarked = async (postId: string, userId: string) => {
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('request_id', postId);
  if (error) throw new Error(error.message);
  return bookmarks.length > 0;
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
