import { supabase } from '@/utils/supabase/supabaseClient';

export const getPostUser = async (userId) => {
  let { data: response_user, error } = await supabase.from('response_posts')
    .select(`
    user_id,
    user (
      ${userId}
    )
  `);
  if (error) {
    return null;
  }

  return response_user;
};
