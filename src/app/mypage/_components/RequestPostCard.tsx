'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { RequestPost } from '../_type/type';
import Image from 'next/image';
import TimeAgo from './TimeAgo';
import { useRouter } from 'next/navigation';
import { calculateDDay } from '@/app/search/_utils/calculateDDay';
import stripHtmlTags from '../_util/striptHtmlTags';

const RequestPostCard: React.FC<{ post: RequestPost }> = ({ post }) => {
  const router = useRouter();
  const [responseCount, setResponseCount] = useState<number>(0);
  const [showActions, setShowActions] = useState<boolean>(false);

  const dDay = calculateDDay(post.date_end || undefined);
  const plainContent = stripHtmlTags(post.content ?? '');

  const fetchResponseCount = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('response_posts')
        .select('id', { count: 'exact' })
        .eq('request_id', post.id);

      if (error) {
        console.error('답변 개수 조회 오류:', error);
        return;
      }

      setResponseCount(data?.length || 0);
    } catch (err) {
      console.error('답변 개수 조회 중 오류 발생:', err);
    }
  }, [post.id]);

  useEffect(() => {
    fetchResponseCount();
  }, [fetchResponseCount]);

  const handleCardClick = () => {
    router.push(`/post/${post.id}`);
  };
  console.log(post.category);
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-3 border-b border-gray-200 bg-white w-full p-6"
    >
      {/* D-Day와 위치 및 카테고리 */}
      <div className="flex justify-between items-center w-full gap-2">
        {/* 왼쪽 - D-Day, 위치 및 카테고리 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-orange-500 text-sm bg-orange-100 rounded-md px-2 py-1">
            {dDay}
          </div>
          <div className="flex items-center text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1">
            <Image
              src="/images/ic-location.svg"
              alt="Location"
              width={12}
              height={12}
            />
            <span className="ml-1">
              {JSON.parse(post.country_city || '{}').country || '위치 없음'}
            </span>
          </div>
          {post.category.slice(0, 2).map((cat, i) => (
            <div
              key={i}
              className="text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* 오른쪽 - 수정 및 삭제 버튼 */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions((prev) => !prev);
            }}
            className="p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={14}
              height={14}
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

      {/* 질문 제목 및 내용 */}
      <div className="flex items-start gap-2">
        <p className="text-blue-500 font-semibold text-base leading-6">Q.</p>
        <div className="flex flex-col">
          <p className="text-black font-bold text-base leading-6 line-clamp-2">
            {post.title}
          </p>
          <p className="text-gray-500 text-sm line-clamp-2">{plainContent}</p>
        </div>
      </div>

      {/* 하단 - 크레딧, 댓글 수, 작성 시간 */}
      <div className="flex justify-between items-center text-sm text-gray-500 w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image src="/images/coin.svg" alt="coin" width={14} height={14} />
            <span>{post.credit} C</span>
          </div>
          {responseCount > 0 && (
            <>
              <span>·</span>
              <span>{responseCount}명 답변</span>
            </>
          )}
        </div>
        <TimeAgo createdAt={post.created_at || new Date().toISOString()} />
      </div>
    </div>
  );
};

export default RequestPostCard;
