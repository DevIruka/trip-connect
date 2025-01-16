'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient';

type Post = {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  country_city?: string;
  category: string;
  img_url: string[];
  request_id?: string;
};

type UnifiedCardProps = {
  post: Post;
  type: 'request' | 'response';
  onDelete?: (postId: string) => void;
};

const PostCard = ({ post, type, onDelete }: UnifiedCardProps) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from(type === 'request' ? 'request_posts' : 'response_posts')
        .delete()
        .eq('id', post.id);

      if (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 문제가 발생했습니다.');
        return;
      }

      alert('삭제가 성공적으로 완료되었습니다.');
      onDelete?.(post.id);
    } catch (error) {
      console.error('예기치 않은 오류 발생:', error);
      alert('예기치 않은 오류가 발생했습니다.');
    }
  };

  const onClickHandler = () => {
    const destination = post.request_id
      ? `/post/${post.request_id}`
      : `/post/${post.id}`;
    router.push(destination);
  };

  return (
    <div
      className="relative p-4 border border-gray-300 rounded-lg flex justify-between items-start cursor-pointer"
      onClick={onClickHandler}
    >
      <div className="flex-1">
        <h2 className="text-md font-bold mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500">
          {type === 'response'
            ? post.content_html?.substring(0, 100)
            : post.content.substring(0, 100)}
          ...
        </p>
      </div>

      {type === 'request' && post.img_url?.length > 0 && (
        <div className="w-20 h-20 ml-4 overflow-hidden rounded">
          <Image
            src={post.img_url[0]}
            alt="Thumbnail"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
      )}

      <div className="relative">
        <button
          className="text-gray-500 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            setMenuVisible((prev) => !prev);
          }}
        >
          ⋮
        </button>
        {menuVisible && (
          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Edit ${type} post: ${post.id}`);
              }}
            >
              수정하기
            </button>
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-black"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
