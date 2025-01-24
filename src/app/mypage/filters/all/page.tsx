'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { UnifiedPost } from '../../_type/type';
import { fetchFilterPost } from '../../_util/fetchFilterPost';
import RequestPostCard from '../../_components/RequestPostCard';
import ResponsePostCard from '../../_components/ResponsePostCard';
import CategoryTabs from '../../_components/CategoryTabs';
import {
  convertTopicsToKorean,
  EnglishCategory,
  KoreanCategory,
  topicMapping,
} from '@/utils/topics';


const WrittenPostsPage: React.FC = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'question' | 'answer'
  >('all');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setError('유저 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchFilterPost(activeFilter, user.id);

        const processedData = data.map((post) => {
          console.log(post);
          console.log('1', 'category' in post);
          console.log('2', Array.isArray(post.category));
          if ('category' in post && Array.isArray(post.category)) {
            const filteredCategories = post.category.filter(
              (cat): cat is EnglishCategory =>
                Object.values<EnglishCategory | KoreanCategory>(topicMapping).includes(cat),
            );

            const koreanCategories = convertTopicsToKorean(filteredCategories) as KoreanCategory[]
            console.log(koreanCategories);
            return {
              ...post,
              category: koreanCategories,
            };
          }
          return post
        });

        setPosts(processedData);
        console.log(processedData)
      } catch (err) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다.', err);
        setError('오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id, activeFilter]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-5 space-y-4 min-h-screen">
      <CategoryTabs activeTab="written" />

      {/* 필터 버튼 */}
      <div
        className="flex items-start gap-2 mt-4"
        style={{ paddingLeft: '20px' }}
      >
        {['all', 'question', 'answer'].map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setActiveFilter(filter as 'all' | 'question' | 'answer')
            }
            className={`flex justify-center items-center gap-2 px-4 py-3 h-9 rounded-full border text-sm font-normal tracking-[-0.28px] ${
              activeFilter === filter
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-transparent text-black'
            }`}
            style={{
              borderRadius: '100px',
              borderWidth: '1px',
              fontFamily: 'Pretendard',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '19.6px',
            }}
          >
            {filter === 'all'
              ? '전체'
              : filter === 'question'
              ? '질문'
              : '답변'}
          </button>
        ))}
      </div>

      {/* 필터링된 글 */}
      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(100vh - 190px)',
          paddingBottom: '50px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          marginTop: '12px',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {posts.length > 0 ? (
          posts.map((post) =>
            post.type === 'question' ? (
              <RequestPostCard key={post.id} post={post} />
            ) : (
              <ResponsePostCard key={post.id} post={post} />
            ),
          )
        ) : (
          <div className="text-center text-gray-500">게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default WrittenPostsPage;
