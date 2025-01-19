'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';

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
    <div className="p-4">
      {/* 유저 프로필 */}
      <div className="flex items-center mb-4">
        <img
          src={userData.profile_img}
          alt="프로필 이미지"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <div className="text-lg font-bold">{userData.nickname}</div>
          <div className="text-sm text-gray-500">{userData.country_verified}</div>
          <p className="text-gray-700">{userData.introduction}</p>
        </div>
      </div>

      {/* 유저 게시물 정보 */}
      <div className="flex justify-around border-t border-b py-4">
        <div>
          <div className="text-lg font-bold">{userPosts.responses.length}</div>
          <div className="text-sm text-gray-500">답변</div>
        </div>
        <div>
          <div className="text-lg font-bold">{userPosts.requests.length}</div>
          <div className="text-sm text-gray-500">질문</div>
        </div>
        <div>
          <div className="text-lg font-bold">{userPosts.reviews.length}</div>
          <div className="text-sm text-gray-500">리뷰</div>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">답변</h2>
        {userPosts.responses.map((post) => (
          <div
            key={post.id}
            className="mb-4 p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-md font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.content_html}</p>
          </div>
        ))}

        <h2 className="text-lg font-bold mt-6 mb-2">질문</h2>
        {userPosts.requests.map((post) => (
          <div
            key={post.id}
            className="mb-4 p-4 border border-gray-300 rounded-lg"
          >
            <h3 className="text-md font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.content}</p>
          </div>
        ))}

        <h2 className="text-lg font-bold mt-6 mb-2">리뷰</h2>
        {userPosts.reviews.map((review) => (
          <div
            key={review.id}
            className="mb-4 p-4 border border-gray-300 rounded-lg"
          >
            <p className="text-sm text-gray-500">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
