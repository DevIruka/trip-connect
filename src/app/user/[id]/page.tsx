'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../_components/Header';
import ProfileSection from '../_components/ProfileSection';
import TabNavigation from '../_components/TabNavigation';
import { UserData } from '../_types/user';
import useInfiniteUserResponsePosts from '@/utils/api/tanstack/user/useInfiniteUserResponsePosts';
import useUserData from '@/utils/api/tanstack/user/useUserData';
import useInfiniteUserRequestPosts from '@/utils/api/tanstack/user/userInfiniteUserRequestPost';
import useInfiniteUserReview from '@/utils/api/tanstack/user/useInfiniteUserReview';
import ResponseItem from '../_components/ResponseItem';
import RequestItem from '../_components/RequestItem';
import ReviewItem from '../_components/ReviewItem';
import LoadMoreButton from '../_components/LoadMoreButton';

const UserPage = () => {
  const { id } = useParams();
  const [reviewCount, setReviewCount] = useState<number[] | [] | null>([]);
  const [responseCount, setResponseCount] = useState<number[] | [] | null>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const { isUserPending } = useUserData(id as string, setUserData);

  const [activeTab, setActiveTab] = useState<
    'responses' | 'requests' | 'reviews'
  >('responses');

  const {
    responseFetchNextPage,
    responseHasNextPage,
    responseIsFetchingNextPage,
    userResponsePost,
  } = useInfiniteUserResponsePosts(id as string, setReviewCount);

  const {
    userRequestPost,
    requestHasNextPage,
    requestFetchNextPage,
    requestIsFetchingNextPage,
  } = useInfiniteUserRequestPosts(id as string, setResponseCount);

  const {
    userReviewPost,
    reviewHasNextPage,
    reviewFetchNextPage,
    reviewIsFetchingNextPage,
  } = useInfiniteUserReview(id as string);

  const resmoreBtnHandler = async () => {
    await responseFetchNextPage();
  };
  const reqmoreBtnHandler = async () => {
    await requestFetchNextPage();
  };
  const revmoreBtnHandler = async () => {
    await reviewFetchNextPage();
  };

  return (
    <div className="inner">
      <Header />
      {isUserPending ? <></> : <ProfileSection userData={userData!} />}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          responses: userResponsePost ? userResponsePost.length : 0,
          requests: userRequestPost ? userRequestPost.length : 0,
          reviews: userReviewPost ? userReviewPost.length : 0,
        }}
      />
      <div className="mt-4">
        {activeTab === 'responses' && (
          <>
            {userResponsePost?.map((post, i) => {
              const review = reviewCount![i];
              return (
                <ResponseItem
                  key={post.id}
                  post={post}
                  review={review}
                  userData={userData!}
                />
              );
            })}
            <LoadMoreButton
              hasNextPage={responseHasNextPage}
              isFetchingNextPage={responseIsFetchingNextPage}
              onClick={resmoreBtnHandler}
            >
              더보기
            </LoadMoreButton>
          </>
        )}
        {activeTab === 'requests' && (
          <>
            {userRequestPost?.map((post, i) => {
              const response = responseCount![i];
              return (
                <RequestItem
                  key={post.id}
                  post={post}
                  responseCount={response}
                />
              );
            })}
            <LoadMoreButton
              hasNextPage={requestHasNextPage}
              isFetchingNextPage={requestIsFetchingNextPage}
              onClick={reqmoreBtnHandler}
            >
              더보기
            </LoadMoreButton>
          </>
        )}
        {activeTab === 'reviews' && (
          <>
            {userReviewPost?.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}

            <LoadMoreButton
              hasNextPage={reviewHasNextPage}
              isFetchingNextPage={reviewIsFetchingNextPage}
              onClick={revmoreBtnHandler}
            >
              더보기
            </LoadMoreButton>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
