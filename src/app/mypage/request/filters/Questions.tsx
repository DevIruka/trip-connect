'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../../_components/PostCard';

type QuestionPost = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  img_url: string[];
};

const Questions = () => {
  const { user } = useUserStore();
  const [questionPosts, setQuestionPosts] = useState<QuestionPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user?.id) {
        setError('사용자 정보가 없습니다. 로그인해주세요.');
        return;
      }

      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url')
          .eq('user_id', user.id);

        if (questionsError) {
          setError('질문 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        setQuestionPosts(questionsData || []);
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('알 수 없는 오류가 발생했습니다.');
      }
    };

    fetchQuestions();
  }, [user]);

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('request_posts')
        .delete()
        .eq('id', questionId);

      if (error) {
        console.error('Error deleting question post:', error);
        return;
      }

      setQuestionPosts((prev) =>
        prev.filter((question) => question.id !== questionId),
      );
    } catch (e) {
      console.error('Unexpected error while deleting question post:', e);
    }
  };

  return (
    <div className="space-y-4">
      {questionPosts.length > 0 ? (
        questionPosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              country_city: post.country_city,
              category: post.category,
              img_url: post.img_url,
            }}
            type="request"
            onDelete={() => handleDeleteQuestion(post.id)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">
          {error || '질문한 글이 없습니다.'}
        </div>
      )}
    </div>
  );
};

export default Questions;
