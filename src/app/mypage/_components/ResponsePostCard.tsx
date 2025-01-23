'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { ResponsePost } from '../_type/type';
import stripHtmlTags from '../_util/striptHtmlTags';
import Image from 'next/image';
import TimeAgo from './TimeAgo';
import { useRouter } from 'next/navigation';

const coinIcon = '/images/coin.svg';
const markerIcon = '/images/ic-location.svg';

const ResponsePostCard: React.FC<{
  post: ResponsePost;
  editable?: boolean;
}> = ({ post, editable = true }) => {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [showActions, setShowActions] = useState<boolean>(false);
  const plainContent = stripHtmlTags(post.free_content || '');

  const fetchCommentCount = useCallback(async () => {
    if (!post.request_id) return;

    try {
      const { count, error } = await supabase
        .from('response_posts')
        .select('*', { count: 'exact', head: true })
        .eq('request_id', post.request_id);

      if (error) {
        console.error('댓글 개수 조회 오류:', error);
        return;
      }

      setCommentCount(count || 0);
    } catch (err) {
      console.error('댓글 개수 조회 중 오류 발생:', err);
    }
  }, [post.request_id]);

  const fetchUserNickname = useCallback(async (userId: string) => {
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
  }, []);

  const fetchRequestDetails = useCallback(async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('request_posts')
        .select('country_city, category')
        .eq('id', requestId)
        .single();

      if (error) {
        console.error('질문글에서 정보 가져오는 중 오류:', error);
        setCountry('알 수 없음');
        setCategory([]);
      } else {
        const countryCity = JSON.parse(data?.country_city || '{}');
        console.log(data);
        setCountry(countryCity.country || '알 수 없음');
        setCategory(data?.category || []);
      }
    } catch (err) {
      console.error('질문글에서 정보 조회 중 오류 발생:', err);
      setCountry('알 수 없음');
      setCategory([]);
    }
  }, []);

  useEffect(() => {
    if (post.user_id) {
      fetchUserNickname(post.user_id);
    }
    if (post.request_id) {
      fetchRequestDetails(post.request_id);
    }
    fetchCommentCount();
  }, [
    post.user_id,
    post.request_id,
    fetchCommentCount,
    fetchUserNickname,
    fetchRequestDetails,
  ]);

  const handleCardClick = () => {
    if (post.request_id) {
      router.push(`/post/${post.request_id}`);
    } else {
      console.error('Request ID가 존재하지 않습니다.');
    }
  };
  console.log(category);
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-3 border-b bg-white w-full p-6 border-gray-200"
    >
      {/* 상단 - 위치와 카테고리 */}
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          {/* 위치 */}
          <div className="flex items-center text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1">
            <Image src={markerIcon} alt="location" width={12} height={12} />
            {country && <span className="ml-1">{country}</span>}
          </div>
          {/* 카테고리 */}
          {(category || []).slice(0, 2).map((cat, i) => (
            <div
              key={i}
              className="text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1"
            >
              {cat}
            </div>
          ))}
        </div>

        {/* More 버튼 */}
        {editable && (
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
              <div className="absolute top-full right-0 flex flex-col gap-2 p-2 bg-white border border-gray-200 rounded-md shadow-md">
                {/* 수정하기 버튼 */}
                <button
                  className="text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/request-edit/${post.id}`);
                  }}
                >
                  수정하기
                </button>
                {/* 삭제하기 버튼 */}
                <button
                  className="text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Delete post: ${post.id}`);
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 제목 및 내용 */}
      <div className="flex items-start gap-2">
        <p className="text-red-500 text-base font-semibold leading-6">A.</p>
        <div className="flex flex-col">
          <div className="mb-2">
            <p className="text-base font-bold text-black leading-6 line-clamp-2">
              {post.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 line-clamp-2">{plainContent}</p>
          </div>
        </div>
      </div>

      {/* 하단 - 크레딧, 댓글 수, 작성 시간 */}
      <div className="flex items-center justify-between text-sm text-gray-500 w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image src={coinIcon} alt="coin" width={14} height={14} />
            <span>50 C</span>
          </div>
          <span>·</span>
          <span>작성자 {nickname}</span>
          <span>·</span>
          <span>댓글 {commentCount}</span>
        </div>
        <TimeAgo createdAt={post.created_at || new Date().toISOString()} />
      </div>
    </div>
  );
};

export default ResponsePostCard;
