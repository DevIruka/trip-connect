'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import UserProfileSection from '../_components/UserProfileSection';
import PostCard from '../_components/PostCard';
import CategoryTabs from '../_components/CategoryTabs';

// 응답글 타입 정의
type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string | null;
  request_id: string | null;
};

const ResponsePage = () => {
  const [profileImg, setProfileImg] = useState<string>(''); // 프로필 이미지 상태
  const [responsePosts, setResponsePosts] = useState<ResponsePost[]>([]); // 응답글 상태

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

    // 응답글 데이터 가져오기
    const fetchResponsePosts = async () => {
      try {
        const { data } = await supabase
          .from('response_posts')
          .select('id, title, content_html, created_at, user_id, request_id');
        setResponsePosts(data || []);
      } catch (error) {
        console.error('Error fetching response posts:', error);
      }
    };

    fetchProfile();
    fetchResponsePosts();
  }, []);

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection profileImg={profileImg} />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="response" />

      {/* 응답글 목록 */}
      {responsePosts.length > 0 ? (
        responsePosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id.toString(),
              title: post.title,
              content: post.content_html,
              country_city: '', // 응답글에는 없으므로 빈 문자열로 설정
              category: '', // 응답글에는 없으므로 빈 문자열로 설정
              img_url: [], // 이미지가 없는 경우 빈 배열로 설정
            }}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">응답한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default ResponsePage;
