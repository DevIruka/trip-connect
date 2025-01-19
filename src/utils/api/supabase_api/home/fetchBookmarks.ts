import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchBookmarks = async (userId: string) => {
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return bookmarks || [];
};

// 북마크 추가
export const addBookmark = async (postId: string | number, userId: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .insert([{ user_id: userId, request_id: postId }])
    .select();
  if (error) throw new Error(error.message);
};

// 북마크 삭제
export const deleteBookmark = async (
  postId: string | number,
  userId: string | undefined,
) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .match({ user_id: userId, request_id: postId });
  if (error) throw new Error(error.message);
};
