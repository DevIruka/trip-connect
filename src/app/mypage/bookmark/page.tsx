'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import TimeAgo from '../_components/TimeAgo';
import CategoryTabs from '../_components/CategoryTabs';
import { convertTopicsToKorean, EnglishCategory } from '@/utils/topics';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type BookmarkedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: EnglishCategory[];
  date_end?: string | null;
  credit?: number | null;
  created_at: string | null;
};

const BookmarkPage = () => {
  const { user } = useUserStore();
    const router = useRouter();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) {
        setError('활성화된 세션이 없습니다. 로그인해주세요.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching bookmarks for user ID:', user.id);

        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(
            `request_posts (
            id,
            title,
            content,
            country_city,
            category,
            date_end,
            credit,
            created_at
          )`,
          )
          .eq('user_id', user.id);

        if (bookmarksError) {
          console.error(
            '북마크 데이터를 가져오는 중 오류 발생:',
            bookmarksError,
          );
          setError('북마크 데이터를 가져오는 중 문제가 발생했습니다.');
          setLoading(false);
          return;
        }

        console.log('Bookmarks data fetched:', bookmarksData);

        const mappedPosts: BookmarkedPost[] = (bookmarksData || []).flatMap(
          (bookmark: { request_posts: BookmarkedPost | BookmarkedPost[] }) =>
            Array.isArray(bookmark.request_posts)
              ? bookmark.request_posts
              : bookmark.request_posts
              ? [bookmark.request_posts]
              : [],
        );

        console.log('Mapped posts:', mappedPosts);

        setBookmarkedPosts(mappedPosts);
      } catch (e) {
        console.error('예상치 못한 오류 발생:', e);
        setError('오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleRemoveBookmark = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user?.id)
        .eq('request_id', postId);

      if (error) {
        console.error('북마크를 삭제하는 중 오류가 발생했습니다:', error);
        return;
      }

      setBookmarkedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId),
      );
    } catch (e) {
      console.error('북마크 해제 중 예상치 못한 오류 발생:', e);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

return (
  <div className="px-5 space-y-4 min-h-screen">
    <CategoryTabs activeTab="bookmark" />

    <div
      className="overflow-y-auto"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        height: 'calc(100vh - 120px)',
        paddingBottom: '50px',
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => {
          const dDay = post.date_end
            ? Math.max(
                Math.ceil(
                  (new Date(post.date_end).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                ),
                0,
              )
            : null;

          const handleCardClick = () => {
            // 상세 페이지로 이동
            router.push(`/post/${post.id}`);
          };

          return (
            <div
              key={post.id}
              onClick={handleCardClick} // 카드 클릭 이벤트 추가
              className="flex flex-col items-start gap-3 border-b bg-white w-full relative"
              style={{
                padding: '12px 20px 24px 20px',
                borderBottom: '1px solid #F4F4F4',
                background: '#FFF',
                cursor: 'pointer', // 마우스 커서를 포인터로 변경
              }}
            >
              <div className="flex flex-row items-center gap-2">
                {/* D-Day 표시 */}
                {dDay !== null && (
                  <div
                    className="flex items-center justify-center text-[#FF810B] text-[12px]"
                    style={{
                      height: '22.017px',
                      padding: '0px 6px',
                      transform: 'rotate(-0.024deg)',
                      borderRadius: '4px',
                      background: '#FFECD4',
                    }}
                  >
                    D-{dDay}
                  </div>
                )}
                {/* 나라명 JSON.parse 처리 */}
                <div className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                  {post.country_city
                    ? JSON.parse(post.country_city).country
                    : '위치 없음'}
                </div>
                {post.category.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700"
                  >
                    {convertTopicsToKorean([cat])[0]}
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-[6px]">
                <p className="text-[16px] font-[600] text-[#0582FF] leading-[22.4px]">
                  Q.
                </p>
                <div className="flex flex-col">
                  <div className="mb-[8px]">
                    <p className="text-[16px] font-bold text-black leading-[22.4px] max-w-[315px] line-clamp-2">
                      {post.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#797C80] line-clamp-2">
                      {post.content || ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] text-[#797C80] w-full">
                <div className="flex items-center gap-[6px]">
                  {/* 크레딧 표시 */}
                  <div className="flex items-center gap-[6px]">
                    <Image
                      src="/images/coin.svg"
                      alt="Credit Icon"
                      width={14}
                      height={14}
                    />
                    <span>{post.credit || 0} C</span>
                  </div>
                  {/* 답변자 수 하드코딩 */}
                  <>
                    <div
                      style={{
                        width: '2px',
                        height: '2px',
                        borderRadius: '50%',
                        backgroundColor: '#797C80',
                      }}
                    />
                    <span>1명 답변</span>
                  </>
                </div>
                <TimeAgo
                  createdAt={post.created_at || new Date().toISOString()}
                />
              </div>

              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(post.id);
                  }}
                >
                  <Image
                    src="/images/ic-selectedbookmark.svg"
                    alt="북마크 아이콘"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500">북마크한 글이 없습니다.</div>
      )}
    </div>
  </div>
);

};

export default BookmarkPage;
