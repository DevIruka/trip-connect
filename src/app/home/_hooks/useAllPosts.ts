import { useReqPosts } from '@/utils/api/tanstack/home/useReqPosts';
import { useResPosts } from '@/utils/api/tanstack/home/useResPosts';
import { useEffect, useState } from 'react';
import { Post } from '../_types/homeTypes';

export const useAllPosts = () => {
  // 요청 및 응답 게시물 데이터 불러오기
  const {
    response_posts,
    fetchNextPage: AfetchNextPage,
    hasNextPage: AhasNextPage,
    isFetchingNextPage: AisFetchingNextPage,
  } = useResPosts();
  const {
    request_posts,
    fetchNextPage: QfetchNextPage,
    hasNextPage: QhasNextPage,
    isFetchingNextPage: QisFetchingNextPage,
  } = useReqPosts();

  // 모든 게시물 상태 관리
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  // 응답 게시물 추가 및 중복 제거
  useEffect(() => {
    if (response_posts) {
      setAllPosts((prevPosts) => {
        return [...prevPosts, ...response_posts].filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id),
        );
      });
    }
  }, [response_posts]);

  // 요청 게시물 추가 및 중복 제거
  useEffect(() => {
    if (request_posts) {
      setAllPosts((prevPosts) => {
        return [...prevPosts, ...request_posts].filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id),
        );
      });
    }
  }, [request_posts]);

  // 최신순 정렬
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return {
    sortedPosts,
    fetchNextPage: () => {
      QfetchNextPage();
      AfetchNextPage();
    },
    hasNextPage: QhasNextPage || AhasNextPage,
    isFetchingNextPage: QisFetchingNextPage || AisFetchingNextPage,
  };
};
