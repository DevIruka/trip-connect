import { supabase } from '@/utils/supabase/supabaseClient';

export const getPostUser = async (userId: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return user;
};
