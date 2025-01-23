'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import TimeAgo from '../_components/TimeAgo';
import CategoryTabs from '../_components/CategoryTabs';
import { convertTopicsToKorean, EnglishCategory } from '@/utils/topics';

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
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col items-start gap-3 border-b bg-white w-full relative p-4"
            >
              <div className="flex flex-row items-center gap-2">
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
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.content}</p>
              <TimeAgo
                createdAt={post.created_at || new Date().toISOString()}
              />
              <button
                onClick={() => handleRemoveBookmark(post.id)}
                className="text-red-500 text-sm"
              >
                북마크 해제
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            북마크한 글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
