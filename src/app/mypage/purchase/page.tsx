'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import CategoryTabs from '../_components/CategoryTabs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string;
  request_id: string;
};

const PurchasedPage = () => {
  const { user } = useUserStore();
  const [purchasedPosts, setPurchasedPosts] = useState<ResponsePost[]>([]);
  const router = useRouter();

  const extractFirstImageUrl = (html: string): string | null => {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchPurchasedAnswers = async () => {
      if (!user?.id) return;

      const { data: purchasedData } = await supabase
        .from('purchased_users')
        .select('response_id')
        .eq('user_id', user.id);

      if (!purchasedData || purchasedData.length === 0) return;

      const responseIds = purchasedData.map((item) => item.response_id);

      const { data: responsePostsData } = await supabase
        .from('response_posts')
        .select('id, title, content_html, created_at, user_id, request_id')
        .in('id', responseIds);

      setPurchasedPosts(responsePostsData || []);
    };

    fetchPurchasedAnswers();
  }, [user]);

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="purchased" />

      {/* 구매한 답변 글 목록 */}
      {purchasedPosts.length > 0 ? (
        <ul className="space-y-4">
          {purchasedPosts.map((post) => {
            const firstImageUrl = extractFirstImageUrl(post.content_html); // 첫 번째 이미지 URL 추출
            return (
              <li
                key={post.id}
                className="flex items-start border p-4 rounded-lg shadow cursor-pointer"
                onClick={() => router.push(`/post/${post.request_id}`)} // 질문글 ID 경로로 이동
              >
                {/* 텍스트 정보 */}
                <div className="flex-1">
                  <h2 className="text-md font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-4">
                    작성일: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* 첫 번째 이미지 */}
                {firstImageUrl && (
                  <div className="ml-4 w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={firstImageUrl}
                      alt="답변 이미지"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">구매한 답변이 없습니다.</p>
      )}
    </div>
  );
};

export default PurchasedPage;
