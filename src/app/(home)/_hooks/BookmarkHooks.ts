import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBookmark, deleteBookmark } from './useBookmark';

export const useBookmarkMutations = (userId: string) => {
  const queryClient = useQueryClient();

  // 북마크 추가 Mutation
  const addBookmarkMutation = useMutation<unknown, Error, string>({
    mutationFn: (postId: string) => addBookmark(postId, userId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData<Array<{ request_id: string }>>(
        ['bookmarks', userId],
        (old) => [...(old || []), { request_id: postId }],
      );
    },
  });

  // 북마크 삭제 Mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: (postId: string) => deleteBookmark(postId, userId),
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
