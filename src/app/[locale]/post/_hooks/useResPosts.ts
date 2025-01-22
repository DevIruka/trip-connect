'use client';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export const useResPosts = (postId: string) => {
  return useQuery({
    queryKey: ['response_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('response_posts')
        .select('*')
        .eq('request_id', postId);
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
