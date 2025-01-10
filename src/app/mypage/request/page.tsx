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

  useEffect(() => {
    // 프로필 데이터 가져오기
    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('profile_img')
          .single();
        setProfileImg(data?.profile_img || '');
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    // 작성글 데이터 가져오기
    const fetchWrittenPosts = async () => {
      try {
        const { data } = await supabase
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url');
        setWrittenPosts(data || []);
      } catch (error) {
        console.error('Error fetching written posts:', error);
      }
    };

    fetchProfile();
    fetchWrittenPosts();
  }, []);

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
