'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const postId = params.id; // URL에서 전달된 게시물 ID

  // 게시물 데이터 가져오기
  const {
    data: post,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('request_posts')
        .select('*')
        .eq('id', postId)
        .single(); // 단일 게시물 조회
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // response 게시물 데이터 가져오기
  const { data: response_posts } = useQuery({
    queryKey: ['response_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('response_posts')
        .select('*')
        .eq('request_id', postId);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  console.log(response_posts);

  const [isBookmarked, setIsBookmarked] = useState(false);

  // 북마크 상태 확인
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', '0fdbd37c-1b2e-4142-b50b-e593f13487a7') // 유저 ID
        .eq('request_id', postId);
      setIsBookmarked(bookmarks?.length > 0);
    };
    fetchBookmarkStatus();
  }, [postId]);

  // 북마크 추가
  const handleAddBookmark = async () => {
    const { error } = await supabase
      .from('bookmarks')
      .insert([
        { user_id: '0fdbd37c-1b2e-4142-b50b-e593f13487a7', request_id: postId },
      ]);
    if (!error) setIsBookmarked(true);
  };

  // 북마크 해제
  const handleDeleteBookmark = async () => {
    const { error } = await supabase.from('bookmarks').delete().match({
      user_id: '0fdbd37c-1b2e-4142-b50b-e593f13487a7',
      request_id: postId,
    });
    if (!error) setIsBookmarked(false);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="inner">
      <button onClick={() => router.back()}>뒤로가기</button>
      {post ? (
        <div>
          <div>닉네임</div>
          {isBookmarked ? (
            <button onClick={handleDeleteBookmark}>북마크 해제</button>
          ) : (
            <button onClick={handleAddBookmark}>북마크</button>
          )}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p>
            {JSON.parse(post.category).map((item) => (
              <>{item}</>
            ))}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            여행 지역: {post.country_city}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            답변 기한: {post.date_end}
          </p>
          <p className="text-sm text-gray-500 mb-4">크레딧: {post.credit}</p>
          <p className="mb-4">{post.content}</p>
          <button>답변하기</button>
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}
    </div>
  );
};

export default DetailPage;
