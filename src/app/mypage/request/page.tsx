'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import UserProfileSection from '../_components/UserProfileSection';
import PostCard from '../_components/PostCard';
import CategoryTabs from '../_components/CategoryTabs';

type Post = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  img_url: string[];
};

const RequestPage = () => {
  const [profileImg, setProfileImg] = useState<string>(''); // 프로필 이미지 상태
  const [writtenPosts, setWrittenPosts] = useState<Post[]>([]); // 작성글 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

useEffect(() => {
  const fetchProfileAndPosts = async () => {
    try {
      // 로그인된 사용자 정보 가져오기
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setError('No active session. Please log in.');
        return;
      }

      const userId = userData.user.id;

      // 프로필 이미지 가져오기
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('profile_img')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile image:', profileError);
        setProfileImg('');
      } else {
        setProfileImg(profileData?.profile_img || '');
      }

      // 작성글 가져오기
      const { data: postsData, error: postsError } = await supabase
        .from('request_posts')
        .select('id, title, content, country_city, category, img_url')
        .eq('user_id', userId); // user_id로 필터링

      if (postsError) {
        console.error('Error fetching written posts:', postsError);
        setWrittenPosts([]);
      } else {
        setWrittenPosts(postsData || []);
      }
    } catch (e) {
      console.error('Unexpected error:', e);
      setError('An unexpected error occurred.');
    }
  };

  fetchProfileAndPosts();
}, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection profileImg={profileImg} />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="written" />

      {/* 작성글 목록 */}
      {writtenPosts.length > 0 ? (
        writtenPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500">작성한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default RequestPage;
