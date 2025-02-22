'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { ResponsePost } from '../_type/type';

import CategoryTabs from '../_components/CategoryTabs';
import {
  convertTopicsToKorean,
  EnglishCategory,
  KoreanCategory,
  topicMapping,
} from '@/utils/topics';
import { supabase } from '@/utils/supabase/supabaseClient';
import ResponsePostCard from '../_components/ResponsePostCard';

const PurchasePage: React.FC = () => {
  const { user } = useUserStore();
  const [purchasedPosts, setPurchasedPosts] = useState<ResponsePost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPurchasedAnswers = async () => {
      if (!user?.id) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      try {
        const { data: purchasedData, error: purchasedError } = await supabase
          .from('purchased_users')
          .select('response_id')
          .eq('user_id', user.id);

        if (purchasedError) throw purchasedError;

        if (!purchasedData || purchasedData.length === 0) {
          setPurchasedPosts([]);
          setLoading(false);
          return;
        }

        const responseIds = purchasedData.map((item) => item.response_id);

        const { data: responsePostsData, error: responsePostsError } =
          await supabase
            .from('response_posts')
            .select('*')
            .in('id', responseIds);

        if (responsePostsError) throw responsePostsError;

        const formattedPosts: ResponsePost[] = (responsePostsData || []).map(
          (post) => ({
            ...post,
            title: post.title || '',
            translated_title: post.translated_title || '',
            content_html: post.translated_content || '',
            free_content: post.free_content || '',
            translated_free_content: post.translated_free_content || '',
            verified_country: null,
            category: [],
            img_url: [],
            type: 'answer',
            credit: null,
          }),
        );

        const processedPosts = await Promise.all(
          formattedPosts.map(async (post) => {
            if (post.request_id) {
              const { data: requestData, error: requestError } = await supabase
                .from('request_posts')
                .select('*')
                .eq('id', post.request_id)
                .single();

              if (requestError) {
                console.error('카테고리 데이터 가져오기 오류:', requestError);
                return post;
              }

              const filteredCategories = (requestData?.category || []).filter(
                (
                  cat: EnglishCategory | KoreanCategory,
                ): cat is EnglishCategory =>
                  Object.values<EnglishCategory | KoreanCategory>(
                    topicMapping,
                  ).includes(cat),
              );

              const koreanCategories = convertTopicsToKorean(
                filteredCategories,
              ) as KoreanCategory[];

              return {
                ...post,
                category: koreanCategories,
                credit: requestData?.credit || null,
              };
            }

            return post;
          }),
        );

        setPurchasedPosts(processedPosts);
      } catch (error) {
        console.error('구매한 답변글 데이터를 가져오는 중 오류 발생:', error);
        setError('오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedAnswers();
  }, [user]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col px-5 space-y-4 min-h-[calc(100vh-84px)]">
      <CategoryTabs activeTab="purchased" />

      <div
        className="overflow-y-auto h-[calc(100vh-120px)] pb-[24px] md:pb-[100px]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {purchasedPosts.length > 0 ? (
          <ul>
            {purchasedPosts.map((post) => (
              <ResponsePostCard
                key={post.id}
                post={post}
                editable={false}
                isLangEffects={true}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">구매한 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;
