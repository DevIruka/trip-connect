'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import Header from '../_components/Header';
import ProfileSection from '../_components/ProfileSection';
import TabNavigation from '../_components/TabNavigation';
import PostList from '../_components/PostList';

type UserData = {
  profile_img: string;
  nickname: string;
  country_verified: string;
  introduction: string;
};

type UserPost = {
  id: string;
  title: string;
  content: string;
  content_html?: string;
};

const UserPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<{
    responses: UserPost[];
    requests: UserPost[];
    reviews: UserPost[];
  }>({ responses: [], requests: [], reviews: [] });

  const [activeTab, setActiveTab] = useState<
    'responses' | 'requests' | 'reviews'
  >('responses');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 유저 정보 불러오기
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('profile_img, nickname, country_verified, introduction')
          .eq('id', id)
          .single();

        if (userError) throw userError;
        setUserData(user);

        // 유저 게시물 불러오기
        const { data: responses } = await supabase
          .from('response_posts')
          .select('*')
          .eq('user_id', id);

        const { data: requests } = await supabase
          .from('request_posts')
          .select('*')
          .eq('user_id', id);

        const { data: reviews } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', id);

        setUserPosts({
          responses: responses || [],
          requests: requests || [],
          reviews: reviews || [],
        });
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!userData) return <div>로딩 중...</div>;

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <Header />
      <ProfileSection userData={userData} />
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          responses: userPosts.responses.length,
          requests: userPosts.requests.length,
          reviews: userPosts.reviews.length,
        }}
      />
      <PostList activeTab={activeTab} userPosts={userPosts} />
    </div>
  );
};


export default UserPage;
