'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { calculateDDay } from '@/app/search/_utils/calculateDDay';
import { RequestPost } from '../_type/type';
import TimeAgo from './TimeAgo';
import stripHtmlTags from '../_util/striptHtmlTags';
import { supabase } from '@/utils/supabase/supabaseClient';

const RequestPostCard: React.FC<{ post: RequestPost }> = ({ post }) => {
  const dDay = calculateDDay(post.date_end || undefined);
  const plainContent = stripHtmlTags(post.content ?? '');
  const [responseCount, setResponseCount] = useState<number>(0);

  const fetchResponseCount = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('response_posts')
        .select('id')
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

  return (
    <div
      className="flex flex-col items-start gap-3 border-b bg-white w-full"
      style={{
        padding: '12px 20px 24px 20px',
        borderBottom: '1px solid #F4F4F4',
        background: '#FFF',
      }}
    >
      {/* D-Day와 위치 및 카테고리 */}
      <div className="flex flex-row items-center gap-[4px]">
        <div
          className="flex items-center justify-center text-[#FF810B] text-[12px]"
          style={{
            height: '22.017px',
            padding: '0px 6px',
            transform: 'rotate(-0.024deg)',
            borderRadius: '4px',
            background: '#FFECD4',
          }}
        >
          {dDay}
        </div>
        <div
          className="flex items-center text-[#45484D] text-[12px]"
          style={{
            height: '22px',
            padding: '0px 6px 0px 4px',
            alignItems: 'center',
            gap: '2px',
            borderRadius: '4px',
            background: '#F5F7FA',
          }}
        >
          <Image
            src="/images/ic-location.svg"
            alt="Location"
            width={12}
            height={12}
          />
          <span>
            {JSON.parse(post.country_city || '{}').country || '위치 없음'}
          </span>
        </div>
        {post.category.slice(0, 2).map((cat, i) => (
          <div
            key={i}
            className="flex items-center text-[#45484D] text-[12px]"
            style={{
              height: '22px',
              padding: '0px 6px 0px 4px',
              alignItems: 'center',
              gap: '2px',
              borderRadius: '4px',
              background: '#F5F7FA',
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-[6px]">
        <p className="text-[16px] font-[600] text-[#0582FF] leading-[22.4px]">
          Q.
        </p>
        <div className="flex flex-col">
          <div className="mb-[8px]">
            <p className="text-[16px] font-bold text-black leading-[22.4px] max-w-[315px] line-clamp-2">
              {post.title}
            </p>
          </div>
          <div>
            <p className="text-[14px] text-[#797C80] line-clamp-2">
              {plainContent}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-[#797C80] w-full">
        <div className="flex items-center gap-[6px]">
          <div className="flex items-center gap-[6px]">
            <Image
              src="/images/coin.svg"
              alt="Credit Icon"
              width={14}
              height={14}
            />
            <span>{post.credit} C</span>
          </div>
          {responseCount > 0 && (
            <>
              <div
                style={{
                  width: '2px',
                  height: '2px',
                  borderRadius: '50%',
                  backgroundColor: '#797C80',
                }}
              />
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
