'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';

type Post = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  img_url: string[];
};

type PostCardProps = {
  post: Post;
  onDelete: (postId: string) => void;
};

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuToggle = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('request_posts')
        .delete()
        .eq('id', post.id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
        return;
      }

      alert('게시글이 성공적으로 삭제되었습니다.');
      onDelete(post.id);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('예기치 않은 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative p-4 border border-gray-300 rounded-lg flex justify-between items-start">
      {/* 카드 내용 */}
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="text-sm text-gray-500 mr-2">
            {post.country_city}
          </span>
          <span className="text-sm text-gray-500">· {post.category}</span>
        </div>
        <h2 className="text-md font-bold mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500">{post.content}</p>
      </div>

      {/* 이미지 */}
      {post.img_url && post.img_url.length > 0 && (
        <div className="w-20 h-20 ml-4 overflow-hidden rounded">
          <Image
            src={post.img_url[0]}
            alt="Post Thumbnail"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
      )}

      {/* 점 세 개 아이콘 */}
      <div className="relative">
        <button
          className="text-gray-500 hover:text-black"
          onClick={handleMenuToggle}
        >
          ⋮
        </button>

        {/* 드롭다운 메뉴 */}
        {menuVisible && (
          <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-black"
              onClick={() => console.log(`Edit post: ${post.id}`)}
            >
              수정하기
            </button>
            <button
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-black"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      {/* 게시물 클릭 시 /post/[postId]로 이동 */}
      <Link href={`/post/${post.id}`} passHref>
        <div className="absolute inset-0 w-full h-full cursor-pointer"></div>
      </Link>
    </div>
  );
};

export default PostCard;
