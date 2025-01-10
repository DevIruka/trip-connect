'use client';

import { useRouter } from 'next/navigation';
import { usePost } from '../_hooks/usePost';
import { useResPosts } from '../_hooks/useResPosts';
import { useBookmarkMutations } from '@/app/(home)/_hooks/BookmarkHooks';
import { useBookmarks } from '@/app/(home)/_hooks/useBookmark';
import Link from 'next/link';
import useTranslate from '../_hooks/useTranslate';
import RenderTranslatedHTML from '../_components/RenderTranslatedHTML';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  const router = useRouter();
  const postId = params.id; // URL에서 전달된 게시물 ID
  const { data: post, error, isLoading } = usePost(postId);
  const { data: response_posts } = useResPosts(postId);
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const { isPostBookmarked } = useBookmarks(userId);
  const bookmarked = isPostBookmarked(postId);
  const text = response_posts ? response_posts[0]?.content_html : '';

  const {
    data: translatedText,
    isLoading: isTransLoading,
    error: transError,
  } = useTranslate(text);

  if (isTransLoading) return <div>번역 중...</div>;
  if (transError) return <div>에러 발생: {(error as Error).message}</div>;

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="inner">
      <button onClick={() => router.back()}>뒤로가기</button>
      {post ? (
        <div>
          <div>닉네임</div>
          {bookmarked ? (
            <button
              onClick={() => {
                deleteBookmarkMutation.mutate(postId);
              }}
            >
              북마크 해제
            </button>
          ) : (
            <button
              onClick={() => {
                addBookmarkMutation.mutate(postId);
              }}
            >
              북마크
            </button>
          )}
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div>
            {post.category?.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="bg-gray-500 w-fit rounded-xl px-2"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            여행 지역: {post.country_city}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            답변 기한: {post.date_end}
          </p>
          <p className="text-sm text-gray-500 mb-4">크레딧: {post.credit}</p>
          <p className="mb-4">{post.content}</p>
          <Link
            href={`/response/${postId}`}
            className="bg-gray-500 w-full rounded-sm px-2"
          >
            답변하기
          </Link>
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}

      {/* 답변 게시물 */}
      <div>답변 {response_posts?.length}개</div>
      {response_posts?.map((post) => (
        <div key={post.id}>
          ------
          <div>{post.title}</div>
          <RenderTranslatedHTML data={JSON.parse(translatedText)} />
        </div>
      ))}
    </div>
  );
};

export default DetailPage;
