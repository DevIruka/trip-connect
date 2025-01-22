import React from 'react';
import { UserData, UserPostData } from '../_types/user';
import ResponseItem from './ResponseItem';
import RequestItem from './RequestItem';
import ReviewItem from './ReviewItem';
import { ReqResPost } from '@/app/search/[id]/_components/SearchResults';

type PostListProps = {
  activeTab: 'responses' | 'requests' | 'reviews';
  userPosts: UserPostData;
  userProfile: UserData;
  userResponsePost : ReqResPost[]
  userData : UserData
  reviewCount : number[]
};

const PostList: React.FC<PostListProps> = ({
  activeTab,
  userProfile,
  userResponsePost,
  reviewCount,
  userData,
}) => (
  <div className="mt-4">
    {activeTab === 'responses' &&
      userResponsePost?.map((post, i) => {
        const review = reviewCount[i];
        return <ResponseItem key={post.id} post={post} review={review} userData={userData} />;
      })}
    {/* {activeTab === 'requests' &&
      userPosts.requests.map((post) => (
        <RequestItem key={post.id} post={post} />
      ))}
    {activeTab === 'reviews' &&
      userPosts.reviews.map((review) => (
        <ReviewItem key={review.id} review={review} userProfile={userProfile} />
      ))} */}
  </div>
);

export default PostList;
