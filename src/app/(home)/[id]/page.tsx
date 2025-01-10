'use client';

import Navbar from '../_components/navBar';
import QnaHeader from '../_components/qnaHeader';
import { useBookmarkMutations } from '../_hooks/BookmarkHooks';
import { useBookmarks } from '../_hooks/useBookmark';
import { usePosts } from '../_hooks/usePosts';

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const category = params.id;
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(category);
  const { isPostBookmarked } = useBookmarks(userId);

  return (
    <>
      <div className="inner">
        <QnaHeader />
        <Navbar />
        {allPosts?.map((post) => {
          const bookmarked = isPostBookmarked(post.id);
          return (
            <div
              onClick={() => {
                location.href = `/post/${post.id}`;
              }}
              key={post.id}
              className="border-2 flex cursor-pointer"
            >
              <div>
                <div>{post.title}</div>
                <div>{post.content}</div>
                <div>{post.credit}</div>
                <div>{post.date_end}</div>
              </div>
              {bookmarked ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBookmarkMutation.mutate(post.id);
                  }}
                >
                  북마크 해제
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addBookmarkMutation.mutate(post.id);
                  }}
                >
                  북마크
                </button>
              )}
            </div>
          );
        })}

        {/* 더보기 버튼 */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{ marginTop: '20px', padding: '10px 20px' }}
          >
            {isFetchingNextPage ? '로딩 중...' : '더보기'}
          </button>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
