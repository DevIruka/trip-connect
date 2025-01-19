import React from 'react';
import { UserPost } from '../_types/user';

type PostItemProps = {
  post: UserPost;
};

const PostItem: React.FC<PostItemProps> = ({ post }) => (
  <div className="mb-4 p-4 border border-gray-300 rounded-lg">
    <h3 className="text-md font-bold">{post.title}</h3>
    {post.content_html && <p className="text-sm text-gray-500">{post.content_html}</p>}
    {post.content && <p className="text-sm text-gray-500">{post.content}</p>}
  </div>
);

export default PostItem;
