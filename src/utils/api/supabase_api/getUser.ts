import { createClient } from '@/utils/supabase/server';

export const getUser = async () => {
  const supabase = await createClient();
  const { data: userData, error: userDataError } =
    await supabase.auth.getUser();

  if (userDataError || !userData.user) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userData.user.id);

  if (error) {
    return null;
  }

  return user[0];
};
