'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';

type UnifiedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question' | 'answer';
  user_id?: string; // 작성자 ID 추가
  request_id?: string; // 답변글의 질문글 ID
};

type UnifiedCardProps = {
  post: UnifiedPost;
  onDelete?: (postId: string) => void;
};

const PostCard = ({ post, onDelete }: UnifiedCardProps) => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useUserStore(); // Zustand에서 로그인된 사용자 정보 가져오기

  const handleDelete = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 답변글 삭제 시 작성자와 현재 유저 비교
    if (post.type === 'answer' && post.user_id !== user.id) {
      alert('답변글은 작성자만 삭제할 수 있습니다.');
      return;
    }

    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const deleteFrom =
        post.type === 'question' ? 'request_posts' : 'response_posts';

      const { error } = await supabase
        .from(deleteFrom)
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
    const targetId = post.type === 'answer' ? post.request_id : post.id;
    if (!targetId) {
      alert('잘못된 게시물 데이터입니다.');
      return;
    }
    router.push(`/post/${targetId}`);
  };

  return (
    <div
      className="relative p-4 border border-gray-300 rounded-lg flex justify-between items-start cursor-pointer"
      onClick={onClickHandler}
    >
      <div className="flex-1">
        <h2 className="text-md font-bold mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500">
          {post.content ? post.content.substring(0, 100) : '내용이 없습니다'}...
        </p>
        <div className="text-sm text-gray-500">
          {post.category.length > 0 ? post.category.join(', ') : '기타'}
        </div>
      </div>

      {post.img_url.length > 0 && (
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

      {user && (
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
                  console.log(`Edit post: ${post.id}`);
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
      )}
    </div>
  );
};

export default PostCard;
