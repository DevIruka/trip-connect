import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addLike,
  deleteLike,
  fetchLike,
  getLikeCount,
} from '../../supabase_api/post/fetchLike';

export const useLike = (userId: string | undefined) => {
  const { data: likes = [] } = useQuery({
    queryKey: ['like', userId],
    queryFn: () => {
      if (userId) {
        return fetchLike(userId);
      }
    },
    initialData: [], // 초기 데이터 설정
    enabled: !!userId,
  });

  const isPostLiked = (postId: string | number) =>
    likes?.some((like) => like.request_id === postId);

  return {
    isPostLiked,
  };
};

export const useLikeMutations = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation<
    unknown,
    Error,
    { postId: string | number; isLiked: boolean }
  >({
    mutationFn: async ({ postId, isLiked }) => {
      if (!userId) {
        return Promise.reject(new Error('User ID가 정의되지 않았습니다.'));
      }
      return isLiked ? deleteLike(postId, userId) : addLike(postId, userId);
    },
    onSuccess: (_, { postId, isLiked }) => {
      queryClient.setQueryData<Array<{ request_id: string | number }>>(
        ['like', userId],
        (old) => {
          const currentLikes = old || [];
          return isLiked
            ? currentLikes.filter((like) => like.request_id !== postId) // 삭제
            : [...currentLikes, { request_id: postId }]; // 추가
        },
      );
    },
  });

  return {
    toggleLikeMutation,
  };
};

export const useLikeCount = (requestId: string | number) => {
  const { data: likeCount } = useQuery({
    queryKey: ['likeCount', requestId],
    queryFn: () => getLikeCount(requestId),
  });

  return { likeCount };
};
