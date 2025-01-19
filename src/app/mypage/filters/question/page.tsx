'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import RequestPostCard from '../../_components/RequestPostCard';
import { RequestPost } from '../../_type/type';

const convertTopicsToKorean = (topics: string[]): string[] => {
  const topicMapping: Record<string, string> = {
    food: '맛집',
    shopping: '쇼핑',
    lodging: '숙소',
    event: '이벤트',
    'schedule-expenses': '일정/경비',
    culture: '문화',
    history: '역사',
    activity: '액티비티',
    etc: '기타',
  };
  return topics.map((topic) => topicMapping[topic] || topic);
};

const QuestionPostsPage = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<RequestPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setError('유저 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('request_posts')
          .select(
            'id, title, content, country_city, category, img_url, user_id, date_end, credit, created_at',
          )
          .eq('user_id', user.id);

        if (error) {
          setError('질문 데이터를 가져오는 중 문제가 발생했습니다.');
          return;
        }

        const formattedPosts: RequestPost[] = (data || []).map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          type: 'question',
          img_url: post.img_url || [],
          country_city: post.country_city || '',
          category: convertTopicsToKorean(post.category || []),
          user_id: post.user_id,
          date_end: post.date_end || null,
          credit: post.credit || null,
          created_at: post.created_at || null,
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error('데이터 가져오기 오류:', err);
        setError('알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => <RequestPostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center text-gray-500">질문이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default QuestionPostsPage;
