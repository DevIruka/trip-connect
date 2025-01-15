import {
  addBookmark,
  deleteBookmark,
} from '@/utils/api/supabase_api/home/fetchBookmarks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useBookmarkMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  // 북마크 추가 Mutation
  const addBookmarkMutation = useMutation<unknown, Error, string | number>({
    mutationFn: (postId: string | number) => {
      if (userId) {
        return addBookmark(postId, userId);
      } else {
        alert('로그인해주세요');
      }
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Array<{ request_id: string }>>(
        ['bookmarks', userId],
        (old) => [...(old || []), { request_id: postId }],
      );
    },
  });

  // 북마크 삭제 Mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: (postId: string | number) => deleteBookmark(postId, userId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Array<{ request_id: string }>>(
        ['bookmarks', userId],
        (old) =>
          (old || []).filter((bookmark) => bookmark.request_id !== postId),
      );
    },
  });

  return {
    addBookmarkMutation,
    deleteBookmarkMutation,
  };
};
