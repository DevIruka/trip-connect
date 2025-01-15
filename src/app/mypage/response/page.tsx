'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import UserProfileSection from '../_components/UserProfileSection';
import PostCard from '../_components/PostCard';
import CategoryTabs from '../_components/CategoryTabs';

type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string | null;
  request_id: string | null;
};

const ResponsePage = () => {
  const { user } = useUserStore(); 
  const [profileImg, setProfileImg] = useState<string>('');
  const [responsePosts, setResponsePosts] = useState<ResponsePost[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateCounts = async () => {
    console.log('Counts updated.');
  };

  const handleDeleteResponse = async (responseId: number) => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .delete()
        .eq('id', responseId);

      if (error) {
        console.error('Error deleting response post:', error);
        return;
      }

      setResponsePosts((prev) =>
        prev.filter((response) => response.id !== responseId),
      );

      handleUpdateCounts();
    } catch (e) {
      console.error('Unexpected error while deleting response post:', e);
    }
  };

  useEffect(() => {
    const fetchProfileAndResponses = async () => {
      if (!user?.id) {
        setError('No active session. Please log in.');
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('profile_img')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile image:', profileError);
          setProfileImg('');
        } else {
          setProfileImg(profileData?.profile_img || '');
        }

        // 응답글 가져오기
        const { data: responseData, error: responseError } = await supabase
          .from('response_posts')
          .select('id, title, content_html, created_at, user_id, request_id')
          .eq('user_id', user.id);

        if (responseError) {
          console.error('Error fetching response posts:', responseError);
          setResponsePosts([]);
        } else {
          setResponsePosts(responseData || []);
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('An unexpected error occurred.');
      }
    };

    fetchProfileAndResponses();
  }, [user]); 

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection profileImg={profileImg} />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="response" onUpdateCounts={handleUpdateCounts} />

      {/* 응답글 목록 */}
      {responsePosts.length > 0 ? (
        responsePosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id.toString(),
              title: post.title,
              content: post.content_html,
              country_city: '',
              category: '',
              img_url: [],
            }}
            onDelete={() => handleDeleteResponse(post.id)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">응답한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default ResponsePage;
