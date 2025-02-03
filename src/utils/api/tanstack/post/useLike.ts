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
    { postId: string | number; isLiked: boolean },
    {
      previousLikes?: Array<{ request_id: string | number }>;
      previousLikeCount?: number;
    }
  >({
    mutationFn: async ({ postId, isLiked }) => {
      if (!userId) {
        return Promise.reject(new Error('User ID가 정의되지 않았습니다.'));
      }
      return isLiked ? deleteLike(postId, userId) : addLike(postId, userId);
    },

    onMutate: async ({ postId, isLiked }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: ['like', userId] });
      await queryClient.cancelQueries({ queryKey: ['likeCount', postId] }); // ✅ likeCount 캐시 취소

      const previousLikes = queryClient.getQueryData<
        Array<{ request_id: string | number }>
      >(['like', userId]);
      const previousLikeCount = queryClient.getQueryData<number>([
        'likeCount',
        postId,
      ]); // ✅ 기존 likeCount 저장

      queryClient.setQueryData<Array<{ request_id: string | number }>>(
        ['like', userId],
        (old) => {
          const currentLikes = old || [];
          return isLiked
            ? currentLikes.filter((like) => like.request_id !== postId) // 삭제
            : [...currentLikes, { request_id: postId }]; // 추가
        },
      );
      queryClient.setQueryData<number>(
        ['likeCount', postId],
        (old) => (old !== undefined ? (isLiked ? old - 1 : old + 1) : old), // ✅ 화면상에서 즉시 반영
      );
      return { previousLikes, previousLikeCount }; // 이전 상태 저장 (rollback 대비)
    },

    onError: (err, { postId }, context) => {
      queryClient.setQueryData(['like', userId], context?.previousLikes); // 롤백
      queryClient.setQueryData(
        ['likeCount', postId],
        context?.previousLikeCount,
      ); // ✅ likeCount 롤백
    },

    onSettled: (_, __, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['like', userId] });
      queryClient.invalidateQueries({ queryKey: ['likeCount', postId] });
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
