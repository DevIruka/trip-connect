'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { UnifiedPost } from '../../_type/type';
import { fetchFilterPost } from '../../_util/fetchFilterPost';
import RequestPostCard from '../../_components/RequestPostCard';
import ResponsePostCard from '../../_components/ResponsePostCard';
import CategoryTabs from '../../_components/CategoryTabs';
import { convertTopicsToKorean, EnglishCategory, topicMapping } from '@/utils/topics';

const WrittenPostsPage: React.FC = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'question' | 'answer'>('all');

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
          if ('category' in post && Array.isArray(post.category)) {
            const filteredCategories = post.category.filter(
              (cat): cat is EnglishCategory =>
                Object.values<string>(topicMapping).includes(cat),
            );

            const koreanCategories = convertTopicsToKorean(filteredCategories);

            return {
              ...post,
              category: koreanCategories, 
            };
          }
          return post;
        });

        setPosts(processedData);
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
        className="inline-flex items-start gap-[4px] mt-[16px]"
        style={{ width: '100%', paddingLeft: '20px' }}
      >
        {['all', 'question', 'answer'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as 'all' | 'question' | 'answer')}
            className={`flex items-center justify-center px-[16px] py-[12px] h-[36px] rounded-full ${
              activeFilter === filter
                ? 'border-[#000] bg-[#000] text-[#FFF]'
                : 'border-[#DFE1E5] bg-transparent text-[#000]'
            }`}
            style={{
              borderWidth: '1px',
              fontFamily: 'Pretendard',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '19.6px',
              letterSpacing: '-0.28px',
            }}
          >
            {filter === 'all' ? '전체' : filter === 'question' ? '질문' : '답변'}
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

