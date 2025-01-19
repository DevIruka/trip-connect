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
        return Promise.reject(new Error('User ID가 정의되지 않았습니다.'))
      }
    },
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Array<{ request_id: string | number }>>(
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
