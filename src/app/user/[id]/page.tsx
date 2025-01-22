'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import Header from '../_components/Header';
import ProfileSection from '../_components/ProfileSection';
import TabNavigation from '../_components/TabNavigation';
import PostList from '../_components/PostList';
import {
  UserPostData,
  UserData,
  ReviewPost,
  ResponsePost,
  RequestPost,
} from '../_types/user';
import useInfiniteUserResponsePosts from '@/utils/api/tanstack/user/useInfiniteUserResponsePosts';
import useUserData from '@/utils/api/tanstack/user/useUserData';

type BaseResponsePost = Omit<
  ResponsePost,
  'user_nickname' | 'comment_count'
> & {
  request_posts: {
    country_city: string;
    category: string;
    credit: number;
    user_id: string;
  }[];
};

const UserPage = () => {
  const { id } = useParams();
  const [reviewCount, setReviewCount] = useState<number[] | [] | null>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const { data, isUserPending } = useUserData(id as string, setUserData);

  const [activeTab, setActiveTab] = useState<
    'responses' | 'requests' | 'reviews'
  >('responses');

  const {
    responseFetchNextPage,
    responseHasNextPage,
    responseIsFetchingNextPage,
    isPending,
    userResponsePost,
  } = useInfiniteUserResponsePosts(id as string, setReviewCount);

  console.log(userResponsePost)

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data: user, error: userError } = await supabase
  //       .from('users')
  //       .select('profile_img, id, nickname, country_verified, introduction')
  //       .eq('id', id)
  //       .single();
  //       setUserData(user)
  //   };
  //   fetchUser();
  // }, []);

  // useEffect(()=>{
  //       const { data: user, error: userError } = await supabase
  //         .from('users')
  //         .select('profile_img, id, nickname, country_verified, introduction')
  //         .eq('id', id)
  //         .single();
  // })

  // const {
  //   responseFetchNextPage,
  //   responseHasNextPage,
  //   responseIsFetchingNextPage,
  //   searchedResponsePost,
  // } = useInfiniteUserResponsePosts(userData.id);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // 유저 정보 불러오기
  //       const { data: user, error: userError } = await supabase
  //         .from('users')
  //         .select('profile_img, id, nickname, country_verified, introduction')
  //         .eq('id', id)
  //         .single();

  //       if (userError) throw userError;
  //       setUserData(user);

  //       // 유저 게시물 불러오기
  //       const { data: responses } = await supabase
  //         .from('response_posts')
  //         .select(
  //           `
  //       id,
  //       title,
  //       free_content,
  //       request_id,
  //       created_at,
  //       request_posts!inner(
  //         country_city,
  //         category,
  //         credit,
  //         user_id
  //   )
  //     `,
  //         )
  //         .eq('user_id', id);

  //       const enhancedResponses = await Promise.all(
  //         ((responses || []) as BaseResponsePost[]).map(async (response) => {
  //           const requestPost = response.request_posts?.[0];

  //           if (!requestPost) {
  //             return {
  //               ...response,
  //               user_nickname: '',
  //               comment_count: 0,
  //             };
  //           }

  //           const userQuery = await supabase
  //             .from('users')
  //             .select('nickname')
  //             .eq('id', requestPost.user_id)
  //             .single();

  //           const reviewsQuery = await supabase
  //             .from('reviews')
  //             .select('*', { count: 'exact' })
  //             .eq('response_id', response.id);

  //           return {
  //             ...response,
  //             request_posts: requestPost,
  //             user_nickname: userQuery?.data?.nickname || '',
  //             comment_count: reviewsQuery?.count || 0,
  //           };
  //         }),
  //       );

  //       const { data: requests } = await supabase
  //         .from('request_posts')
  //         .select(
  //           'id, title, content, country_city, category, date_end, created_at, credit',
  //         )
  //         .eq('user_id', id);

  //       const { data: reviews, error: reviewsError } = await supabase
  //         .from('reviews')
  //         .select('id, review, user_id, response_id')
  //         .eq('user_id', id);

  //       if (reviewsError) throw reviewsError;

  //       const { data: purchasedUsers, error: purchasedError } = await supabase
  //         .from('purchased_users')
  //         .select('response_id, created_at');

  //       if (purchasedError) throw purchasedError;

  //       console.log('Purchased Users:', purchasedUsers);
  //       console.log('Reviews:', reviews);

  //       const formattedReviews = (reviews || []).map((review) => {
  //         const purchasedUser = purchasedUsers?.find(
  //           (user) => user.response_id === review.response_id,
  //         );
  //         return {
  //           ...review,
  //           purchasedAt: purchasedUser?.created_at || null,
  //         };
  //       });

  //       setUserPosts({
  //         responses: enhancedResponses as ResponsePost[],
  //         requests: (requests || []) as RequestPost[],
  //         reviews: formattedReviews as ReviewPost[],
  //       });
  //     } catch (error) {
  //       console.error('데이터 불러오기 오류:', error);
  //     }
  //   };

  //   fetchUserData();
  // }, [id]);

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <Header />
      {isUserPending ? <></> : <ProfileSection userData={userData!} />}
      {/* <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          responses: userResponsePost ? userResponsePost.length : 0,
          // requests: userPosts.requests.length,
          // reviews: userPosts.reviews.length,
        }}
      /> */}
      {/* <PostList
        activeTab={activeTab}
        // userResponsePost={userResponsePost}
        // reviewCount={reviewCount}
        // userPosts={userPosts}
        // userProfile={userData}
      /> */}
    </div>
  );
};

export default UserPage;
