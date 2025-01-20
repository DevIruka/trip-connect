import React from 'react';
import { UserData, UserPostData } from '../_types/user';
import ResponseItem from './ResponseItem';
import RequestItem from './RequestItem';
import ReviewItem from './ReviewItem';

type PostListProps = {
  activeTab: 'responses' | 'requests' | 'reviews';
  userPosts: UserPostData;
  userProfile: UserData
};

const PostList: React.FC<PostListProps> = ({ activeTab, userPosts,userProfile }) => (
  <div className="mt-4">
    {activeTab === 'responses' &&
      userPosts.responses.map((post) => (
        <ResponseItem key={post.id} post={post} />
      ))}
    {activeTab === 'requests' &&
      userPosts.requests.map((post) => (
        <RequestItem key={post.id} post={post} />
      ))}
    {activeTab === 'reviews' &&
      userPosts.reviews.map((review) => (
        <ReviewItem key={review.id} review={review} userProfile={userProfile} />
      ))}
  </div>
);

export default PostList;
