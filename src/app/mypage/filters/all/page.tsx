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
import { useTranslation } from 'react-i18next';

const WrittenPostsPage: React.FC = () => {
  const { t } = useTranslation('mypage');
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
        setError(t('noUser'));
        setLoading(false);
        return;
      }

      try {
        const data = await fetchFilterPost(activeFilter, user.id);

        const processedData = data.map((post) => {
          if ('category' in post && Array.isArray(post.category)) {
            const filteredCategories = post.category.filter(
              (cat): cat is EnglishCategory =>
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
            };
          }
          return post;
        });

        setPosts(processedData);
      } catch (err) {
        console.error(t('fetchError'), err);
        setError(t('tryAgain'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id, activeFilter, t]);

  if (loading) return <div>loaing...</div>;
  if (error) return <div>error</div>;

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
              ? t('all')
              : filter === 'question'
              ? t('question')
              : t('answer')}
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
          <div className="text-center text-gray-500">{t('noPosts')}</div>
        )}
      </div>
    </div>
  );
};

export default WrittenPostsPage;
