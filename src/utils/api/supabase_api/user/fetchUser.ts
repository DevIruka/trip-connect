import { supabase } from '@/utils/supabase/supabaseClient';

export const fetchUser = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('profile_img, id, nickname, country_verified, introduction')
    .eq('id', id)
    .single();

  if (error) {
    console.error('fetchUser error:', error.message);
    throw new Error(error.message);
  }

  return data;
};
