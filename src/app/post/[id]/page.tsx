'use client';

import { useRouter } from 'next/navigation';
import { usePost } from '../_hooks/usePost';
import { useResPosts } from '../_hooks/useResPosts';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import Link from 'next/link';
import useTranslate from '../_hooks/useTranslate';
import RenderTranslatedHTML from '../_components/RenderTranslatedHTML';
import backButton from '../../../../public/images/back.svg';
import bookmarkButton from '../../../../public/images/bookmark.svg';
import Image from 'next/image';
import { topicMapping } from '@/utils/topics';

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
  const title = response_posts ? response_posts[0]?.title : '';

  const topicArr = Object.entries(topicMapping);

  const {
    data: translatedText,
    isLoading: isTransLoading,
    error: transError,
  } = useTranslate(text);

  const { data: translatedTitle } = useTranslate(title);
  console.log('translatedTitle', translatedTitle);
  if (isTransLoading) return <div>번역 중...</div>;
  if (transError) return <div>에러 발생: {(error as Error).message}</div>;

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="inner">
      <div className="h-12 place-content-center">
        <button onClick={() => router.back()}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            src={backButton}
            alt="back button"
          />
        </button>
      </div>
      {post ? (
        <div>
          <div>닉네임</div>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex gap-2">
            {post.category
              ? topicArr
                  .filter(([_, value]) => post.category.includes(value))
                  .map(([key, _]) => (
                    <div
                      className="bg-gray-300 rounded-2xl py-1 px-2"
                      key={key}
                    >
                      {key}
                    </div>
                  ))
              : ''}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            여행 지역: {post.country_city}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            답변 기한: {post.date_end}
          </p>
          <p className="text-sm text-gray-500 mb-4">크레딧: {post.credit}</p>
          <p className="mb-4">{post.content}</p>
          <div className="h-12 flex border-t-2">
            {post.user_id === userId ? (
              bookmarked ? (
                <button
                  onClick={() => {
                    deleteBookmarkMutation.mutate(postId);
                  }}
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    src={bookmarkButton}
                    alt="bookmark button"
                    className="brightness-0"
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    addBookmarkMutation.mutate(postId);
                  }}
                >
                  <Image
                    width={20}
                    height={20}
                    src={bookmarkButton}
                    alt="bookmark button"
                  />
                </button>
              )
            ) : (
              ''
            )}
          </div>
          <div className="bg-gray-500 w-full h-12 rounded-sm px-2 flex justify-center items-center mb-5">
            <Link href={`/response/${postId}`}>답변하기</Link>
          </div>
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}

      {/* 답변 게시물 */}
      <div className="h-12 border-b-2">
        {response_posts?.length}개의 답변이 있어요
      </div>
      {response_posts?.map((post) => (
        <div key={post.id}>
          <div className="h-12 flex items-center">
            <RenderTranslatedHTML data={JSON.parse(translatedTitle)} />
          </div>
          <RenderTranslatedHTML data={JSON.parse(translatedText)} />
        </div>
      ))}
    </div>
  );
};

export default DetailPage;
