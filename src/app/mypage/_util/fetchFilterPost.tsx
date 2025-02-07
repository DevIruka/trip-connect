import { supabase } from '@/utils/supabase/supabaseClient';
import { UnifiedPost } from '../_type/type';

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

    if (filter === 'question' || filter === 'all') {
      const { data: questionData, error: questionError } = await supabase
        .from('request_posts')
        .select('*')
        .eq('user_id', userId);

      if (questionError) throw questionError;

      questions = (questionData || []).map((item) => ({
        ...item,
        type: 'question',
      }));
    }

    if (filter === 'answer' || filter === 'all') {
      const { data: answerData, error: answerError } = await supabase
        .from('response_posts')
        .select('*')
        .eq('user_id', userId);

      if (answerError) throw answerError;

      answers = (answerData || []).map((item) => ({
        ...item,
        type: 'answer',
        request_id: item.request_id || '', 
      }));
    }

    return [...questions, ...answers];
  } catch (error) {
    console.error('Error fetching filtered posts:', error);
    return [];
  }
};
