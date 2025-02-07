import { supabase } from "@/utils/supabase/supabaseClient";

export const fetchUserNicknames = async (userIds: (string | null)[]) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname')
    .in('id', userIds); // 여러 user_id를 한번에 조회

  if (error) throw new Error(error.message);
  const nicknameMap = data.reduce((acc, user) => {
    acc[user.id] = user.nickname;
    return acc;
  }, {} as Record<string, string>);

  return nicknameMap;
};