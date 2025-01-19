'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import CategoryTabs from '../_components/CategoryTabs';
import Image from 'next/image';
import TimeAgo from '../_components/TimeAgo'; 

type BookmarkedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  date_end?: string | null;
  credit?: number | null;
  created_at: string | null;
};

const convertTopicsToKorean = (topics: string[]): string[] => {
  const topicMapping: Record<string, string> = {
    food: '맛집',
    shopping: '쇼핑',
    lodging: '숙소',
    event: '이벤트',
    'schedule-expenses': '일정/경비',
    culture: '문화',
    history: '역사',
    activity: '액티비티',
    etc: '기타',
  };
  return topics.map((topic) => topicMapping[topic] || topic);
};

const BookmarkPage = () => {
  const { user } = useUserStore();
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
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(
            `
            request_posts (
              id,
              title,
              content,
              country_city,
              category,
              img_url,
              date_end,
              credit,
              created_at
            )
          `,
          )
          .eq('user_id', user.id);

        if (bookmarksError) {
          console.error(
            '북마크 데이터를 가져오는 중 오류가 발생했습니다:',
            bookmarksError,
          );
          setError('북마크 데이터를 가져오는 중 문제가 발생했습니다.');
          setLoading(false);
          return;
        }

        const mappedPosts: BookmarkedPost[] = (bookmarksData || []).flatMap(
          (bookmark: { request_posts: BookmarkedPost | BookmarkedPost[] }) =>
            Array.isArray(bookmark.request_posts)
              ? bookmark.request_posts
              : bookmark.request_posts
              ? [bookmark.request_posts]
              : [],
        );

        setBookmarkedPosts(mappedPosts);
      } catch (e) {
        console.error('예상치 못한 오류가 발생했습니다:', e);
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
        bookmarkedPosts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col items-start gap-3 border-b bg-white w-full relative"
            style={{
              padding: '12px 20px 24px 20px',
              borderBottom: '1px solid #F4F4F4',
              background: '#FFF',
            }}
          >
            <div className="flex flex-row items-center gap-[4px]">
              <div
                className="flex items-center text-[#45484D] text-[12px]"
                style={{
                  height: '22px',
                  padding: '0px 6px 0px 4px',
                  alignItems: 'center',
                  gap: '2px',
                  borderRadius: '4px',
                  background: '#F5F7FA',
                }}
              >
                <Image
                  src="/images/ic-location.svg"
                  alt="Location"
                  width={12}
                  height={12}
                />
                <p className="text-[12px]">
                  {post.country_city
                    ? JSON.parse(post.country_city).country
                    : ''}
                </p>
              </div>
              {post.category.slice(0, 2).map((cat: string, i: number) => {
                const koreanCategory = convertTopicsToKorean([cat])[0];
                return (
                  <div
                    key={i}
                    className="flex items-center text-[#45484D] text-[12px]"
                    style={{
                      height: '22px',
                      padding: '0px 6px 0px 4px',
                      alignItems: 'center',
                      gap: '2px',
                      borderRadius: '4px',
                      background: '#F5F7FA',
                    }}
                  >
                    {koreanCategory}
                  </div>
                );
              })}
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
                <div className="flex items-center gap-[6px]">
                  <Image
                    src="/images/coin.svg"
                    alt="Credit Icon"
                    width={14}
                    height={14}
                  />
                  <span>{post.credit} C</span>
                </div>
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
        ))
      ) : (
        <div className="text-center text-gray-500">북마크한 글이 없습니다.</div>
      )}
    </div>
  </div>
);
};

export default BookmarkPage;
