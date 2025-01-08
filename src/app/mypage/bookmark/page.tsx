'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import Image from 'next/image';

type Post = {
  content: string;
  title: string;
  country_city: string;
  category: string;
};

const BookmarkPage = () => {
  const [user, setUser] = useState({
    profileImg: '',
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [writtenCount, setWrittenCount] = useState(0);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = 'f7b9a432-75f7-4f6b-9fc6-fb429bdb32ac'; // 테스트용 유저 ID

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('profile_img')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUser({
        profileImg: data.profile_img || '',
      });
    };

    const fetchWrittenPosts = async () => {
      const { data, error } = await supabase
        .from('request_posts')
        .select('content, title, country_city, category')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching written posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    const fetchCounts = async () => {
      // 작성한 글 개수
      const { count: writtenCount, error: writtenError } = await supabase
        .from('request_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 구매한 글 개수
      const { count: purchasedCount, error: purchasedError } = await supabase
        .from('purchased_posts') // 예시 테이블 이름
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 북마크 글 개수
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from('bookmarked_posts') // 예시 테이블 이름
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (!writtenError) setWrittenCount(writtenCount || 0);
      if (!purchasedError) setPurchasedCount(purchasedCount || 0);
      if (!bookmarkError) setBookmarkCount(bookmarkCount || 0);
    };

    fetchUserProfile();
    fetchWrittenPosts();
    fetchCounts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-5">
      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-6">
        {/* 프로필 이미지 */}
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {user.profileImg ? (
              <Image
                src={user.profileImg}
                alt="Profile"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {/* Null일 경우 기본 프로필 */}
              </div>
            )}
          </div>

          <div className="ml-4">
            <h2 className="text-lg font-bold">나의 활동 내역</h2>
          </div>
        </div>

        {/* 질문하기 버튼 */}
        <button className="flex justify-center items-center gap-[10px] px-[12px] py-[7px] rounded-[4px] border border-[#D9D9D9] text-gray-600">
          질문 하기
        </button>
      </div>

      {/* 카테고리 섹션 */}
      <div className="flex justify-between items-center border-b border-[#D9D9D9] mb-6">
        {/* 작성한 글 */}
        <button className="relative pb-2 border-b-2 border-transparent hover:border-black">
          <span className="text-lg font-bold text-black">작성글</span>
          <span className="text-[#808080] font-[Pretendard] text-[16px] font-semibold leading-[1.4] ml-1">
            {writtenCount}
          </span>
        </button>

        {/* 구매한 글 */}
        <button className="relative pb-2 border-b-2 border-transparent hover:border-black">
          <span className="text-lg font-bold text-black">답변글</span>
          <span className="text-[#808080] font-[Pretendard] text-[16px] font-semibold leading-[1.4] ml-1">
            {purchasedCount}
          </span>
        </button>

        {/* 북마크 */}
        <button className="relative pb-2 border-b-2 border-transparent hover:border-black">
          <span className="text-lg font-bold text-black">북마크</span>
          <span className="text-[#808080] font-[Pretendard] text-[16px] font-semibold leading-[1.4] ml-1">
            {bookmarkCount}
          </span>
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500 mr-2">
                    {post.country_city}
                  </span>
                  <span className="text-sm text-gray-500">
                    · {post.category}
                  </span>
                </div>
                <h2 className="text-md font-bold mb-1">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.content}</p>
              </div>
              <button className="text-gray-500">⋮</button>
            </div>
          ))
        ) : (
          <div>작성한 글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;