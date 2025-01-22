'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient'; // Supabase 임포트
import TimeAgo from './TimeAgo'; 
import { useRouter } from 'next/navigation';
const coinIcon = '/images/coin.svg';
const markerIcon = '/images/ic-location.svg';

type ResponsePost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'answer';
  user_id: string;
  request_id?: string;
  created_at: string | null;
  credit: number | null; // null 허용
};

type ResponsePostCardProps = {
  post: ResponsePost;
};

const ResponsePostCard: React.FC<ResponsePostCardProps> = ({ post }) => {
    const router = useRouter(); 
  const [nickname, setNickname] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [showActions, setShowActions] = useState<boolean>(false);

  const fetchUserNickname = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('닉네임 가져오기 오류:', error);
        setNickname('알 수 없음');
      } else {
        setNickname(data?.nickname || '알 수 없음');
      }
    } catch (err) {
      console.error('유저 닉네임 조회 중 오류 발생:', err);
      setNickname('알 수 없음');
    }
  };

  // 댓글 수와 관련된 로직 주석 처리
  /*
  const fetchCommentCount = async (postId: string) => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('post_id', postId);

      if (error) {
        console.error('댓글 수 가져오기 오류:', error);
        setCommentCount(0);
      } else {
        setCommentCount(count || 0);
      }
    } catch (err) {
      console.error('댓글 수 조회 중 오류 발생:', err);
      setCommentCount(0);
    }
  };
  */


  useEffect(() => {
    if (post.user_id) {
      fetchUserNickname(post.user_id);
    }
    // 댓글 수와 관련된 부분 주석 처리 
    // if (post.id) {
    //   fetchCommentCount(post.id);
    // }
  }, [post.user_id, post.id]);

  
  const handleCardClick = () => {
    if (post.request_id) {
      router.push(`/post/${post.request_id}`);
    } else {
      console.error('Request ID가 존재하지 않습니다.');
    }
  }
  
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-3 border-b bg-white w-full"
      style={{
        padding: '12px 20px 24px 20px',
        borderBottom: '1px solid #F4F4F4',
        background: '#FFF',
      }}
    >
      {/* 상단 - 위치와 카테고리 */}
      <div className="flex items-center justify-between w-full gap-[8px]">
        {/* 왼쪽 - 위치와 카테고리 */}
        <div className="flex items-center gap-[8px]">
          {/* 위치 */}
          <div className="flex items-center gap-[4px] bg-[#F5F7FA] text-[#45484D] rounded-md px-[6px] py-[4px] text-[12px]">
            <Image src={markerIcon} alt="location" width={12} height={12} />
            {post.country_city && (
              <span>{JSON.parse(post.country_city)?.country || ''}</span>
            )}
          </div>
          {/* 카테고리 */}
          {post.category.slice(0, 2).map((cat, i) => (
            <div
              key={i}
              className="bg-[#F5F7FA] text-[#45484D] rounded-md px-[6px] py-[4px] text-[12px]"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* 오른쪽 - More 버튼 */}
        <div className="relative">
          <button
            onClick={() => setShowActions((prev) => !prev)}
            className="p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
            >
              <circle cx="12" cy="5" r="2" fill="#797C80" />
              <circle cx="12" cy="12" r="2" fill="#797C80" />
              <circle cx="12" cy="19" r="2" fill="#797C80" />
            </svg>
          </button>
          {showActions && (
            <div
              className="absolute top-full right-0"
              style={{
                display: 'flex',
                width: '129px',
                padding: '8px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '10px',
                borderRadius: '8px',
                border: '1px solid var(--Grayscale-Gray-8-line, #F4F4F4)',
                background: '#FFF',
                boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* 수정하기 버튼 */}
              <button
                className="w-full text-left"
                style={{
                  display: 'flex',
                  padding: '6px 10px',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  color: 'var(--Grayscale-Gray-1, #45484D)',
                  textAlign: 'center',
                  fontFamily: 'Pretendard',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 'normal',
                  letterSpacing: '-0.28px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Edit post: ${post.id}`);
                  if (!post.id) {
                    alert('올바르지 않은 게시글 ID입니다.');
                    return;
                  }
                  if (post.type === 'answer') {
                    router.push(`/response-edit/${post.id}`);
                  } else if (post.type === 'question') {
                    router.push(`/request-edit/${post.id}`);
                  }
                }}
              >
                수정하기
              </button>
              {/* 삭제하기 버튼 */}
              <button
                className="w-full text-left"
                style={{
                  display: 'flex',
                  padding: '6px 10px',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'stretch',
                  borderRadius: '8px',
                  color: 'var(--Grayscale-Gray-1, #45484D)',
                  textAlign: 'center',
                  fontFamily: 'Pretendard',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 'normal',
                  letterSpacing: '-0.28px',
                }}
                onClick={() => console.log(`Delete post: ${post.id}`)}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 제목 및 내용 */}
      <div className="flex items-start gap-[6px]">
        {/* A. 표시 */}
        <p className="text-[16px] font-[600] text-[#FA505B] leading-[22.4px]">
          A.
        </p>

        {/* 제목과 내용을 포함한 컨테이너 */}
        <div className="flex flex-col">
          {/* 제목 */}
          <div className="mb-[8px]">
            <p className="text-[16px] font-bold text-black leading-[22.4px] max-w-[315px] line-clamp-2">
              {post.title}
            </p>
          </div>
          {/* 내용 */}
          <div>
            <p className="text-[14px] text-[#797C80] line-clamp-2">
              {post.content || ''}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 - 크레딧, 작성자 정보, 댓글 수, 작성 시간 */}
      <div className="flex items-center justify-between text-[12px] text-[#797C80] w-full">
        <div className="flex items-center gap-[6px]">
          {/* 크레딧 */}
          <div className="flex items-center gap-[6px]">
            <Image src={coinIcon} alt="coin" width={14} height={14} />
            <span>{post.credit} C</span>
          </div>
          {/* 점 아이콘 */}
          <div
            style={{
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: '#797C80',
            }}
          />
          {/* 작성자 닉네임 */}
          <span>
            작성자 <span className="font-bold">{nickname || '알 수 없음'}</span>
          </span>
          {/* 점 아이콘 */}
          <div
            style={{
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: '#797C80',
            }}
          />
          {/* 댓글 수 */}
          {commentCount !== null && <span>댓글 {commentCount}</span>}
        </div>
        {/* 작성 시간 */}
        <TimeAgo createdAt={post.created_at || new Date().toISOString()} />
      </div>
    </div>
  );
};

export default ResponsePostCard;
