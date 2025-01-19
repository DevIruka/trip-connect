import { supabase } from '@/utils/supabase/supabaseClient';
import { convertTopicsToKorean } from '@/utils/topics';

export type UnifiedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  created_at: string;
  user_id: string;
  type: 'question' | 'answer'; 
};

export const fetchFilterPost = async (
  filter: 'all' | 'question' | 'answer',
  userId: string | undefined,
): Promise<UnifiedPost[]> => {
  if (!userId) {
    console.error('User ID is missing.');
    return [];
  }

  try {
    let questions: UnifiedPost[] = [];
    let answers: UnifiedPost[] = [];

    // 질문글 필터링
    if (filter === 'question' || filter === 'all') {
      const { data: questionData, error: questionError } = await supabase
        .from('request_posts')
        .select('*')
        .eq('user_id', userId);

      if (questionError) throw questionError;

      questions = (questionData || []).map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content || '',
        country_city: item.country_city || '',
        category: convertTopicsToKorean(item.category || []),
        img_url: item.img_url || [],
        created_at: item.created_at,
        user_id: item.user_id,
        type: 'question', 
      }));
    }

    // 답변글 필터링
    if (filter === 'answer' || filter === 'all') {
      const { data: answerData, error: answerError } = await supabase
        .from('response_posts')
        .select('*, request_posts(category)')
        .eq('user_id', userId);

      if (answerError) throw answerError;

      answers = (answerData || []).map((item) => ({
        id: item.id,
        title: item.title,
        content: item.free_content || '',
        country_city: item.verified_country || '',
        category: convertTopicsToKorean(item.request_posts?.category || []),
        img_url: [],
        created_at: item.created_at,
        user_id: item.user_id,
        type: 'answer', 
      }));
    }

    return [...questions, ...answers];
  } catch (error) {
    console.error('Error fetching filtered posts:', error);
    return [];
  }
};
