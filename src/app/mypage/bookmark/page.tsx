'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import UserProfileSection from '../_components/UserProfileSection';
import CategoryTabs from '../_components/CategoryTabs';
import Image from 'next/image';

type Post = {
  id: string;
  title: string;
  content: string;
  img_url: string[];
  country_city: string;
};

type Bookmark = {
  request_posts: Post;
};

const BookmarkPage = () => {
  const { user } = useUserStore();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) {
        setError('활성화된 세션이 없습니다. 로그인해주세요.');
        return;
      }

      try {
        // 북마크 데이터 가져오기
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(
            `
            request_posts (
              id,
              title,
              content,
              img_url,
              country_city
            )
          `,
          )
          .eq('user_id', user.id);

        if (bookmarksError) {
          console.error(
            '북마크 데이터를 가져오는 중 오류가 발생했습니다:',
            bookmarksError,
          );
          setBookmarkedPosts([]);
        } else {
          // 데이터 매핑
          setBookmarkedPosts(
            bookmarksData.map((bookmark: Bookmark) => bookmark.request_posts),
          );
        }
      } catch (e) {
        console.error('예상치 못한 오류가 발생했습니다:', e);
        setError('오류가 발생했습니다. 다시 시도해주세요.');
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
      console.error('북마크를 삭제하는 중 예상치 못한 오류가 발생했습니다:', e);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="bookmark" />

      {/* 북마크된 게시글 */}
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => (
          <div
            key={post.id}
            className="relative p-4 border border-gray-300 rounded-lg flex justify-between items-start"
          >
            {/* 게시글 정보 */}
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500 mr-2">
                  {post.country_city}
                </span>
              </div>
              <h2 className="text-md font-bold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-500">{post.content}</p>
            </div>

            {/* 이미지 */}
            {post.img_url && post.img_url.length > 0 && (
              <div className="w-20 h-20 ml-4 overflow-hidden rounded">
                <Image
                  src={post.img_url[0]}
                  alt="Post Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            {/* 북마크 해제 버튼 */}
            <button
              onClick={() => handleRemoveBookmark(post.id)}
              className="absolute top-2 right-2"
            >
              <Image
                src="/images/bookmark.svg"
                alt="북마크 해제"
                width={24}
                height={24}
                className="hover:opacity-70 cursor-pointer"
              />
            </button>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">북마크한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default BookmarkPage;
