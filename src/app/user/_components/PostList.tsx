import React from 'react';
import PostItem from './PostItem';
import { UserPostData } from '../_types/user';
import ResponseItem from './ResponseItem';

type PostListProps = {
  activeTab: 'responses' | 'requests' | 'reviews';
  userPosts: UserPostData;
};

const PostList: React.FC<PostListProps> = ({ activeTab, userPosts }) => (
  <div className="mt-4">
    {activeTab === 'responses' &&
      userPosts.responses.map((post) => <ResponseItem key={post.id} post={post} />)}
    {activeTab === 'requests' &&
      userPosts.requests.map((post) => <PostItem key={post.id} post={post} />)}
    {activeTab === 'reviews' &&
      userPosts.reviews.map((review) => <PostItem key={review.id} post={review} />)}
  </div>
);

export default PostList;
