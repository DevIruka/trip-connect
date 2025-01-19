import React from 'react';
import Image from 'next/image';
import stripHtmlTags from '../_util/striptHtmlTags';

type UnifiedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question' | 'answer';
  user_id?: string;
  request_id?: string;
};

type Props = {
  post: UnifiedPost;
};

const PostCard: React.FC<Props> = ({ post }) => {
  const plainContent = stripHtmlTags(post.content ?? ''); // `null` 처리

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-4">{plainContent}</p>
      {post.img_url?.[0] && (
        <Image
          src={post.img_url[0]}
          alt="Thumbnail"
          width={100}
          height={100}
          className="rounded"
        />
      )}
      <p className="text-sm text-gray-400">Location: {post.country_city}</p>
    </div>
  );
};

export default PostCard;
