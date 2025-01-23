import { supabase } from '@/utils/supabase/supabaseClient';

type SupabaseReview = {
    id: string;
    review: string;
    user_id: string;
    users: {
      nickname: string | null;
      profile_img: string | null;
    }[] | null; 
  };

  export type Review = {
    id: string;
    review: string;
    user_id: string;
    nickname: string;
    profile_img: string | null;
    purchased_at: string | null;
    country: string | null;
  };
  
export const checkUserCommented = async (response_id: string, user_id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('response_id', response_id)
    .eq('user_id', user_id);

  if (error) throw new Error(`댓글 확인 실패: ${error.message}`);
  return data.length > 0;
};

export const fetchReviews = async (response_id: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, review, user_id,
      users (nickname, profile_img)
    `)
    .eq('response_id', response_id);

  if (error) throw new Error(`리뷰 가져오기 실패: ${error.message}`);

  const userIds = data.map((r) => r.user_id);

  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchased_users')
    .select('user_id, created_at')
    .in('user_id', userIds);

  if (purchaseError) throw new Error(`구매 정보 가져오기 실패: ${purchaseError.message}`);

  const { data: countryData, error: countryError } = await supabase
    .from('users')
    .select('id, country')
    .in('id', userIds);

  if (countryError) throw new Error(`국가 정보 가져오기 실패: ${countryError.message}`);

  // 구매 정보 및 국가 매핑
  const purchaseMap: Record<string, string> = purchaseData?.reduce(
    (acc, cur) => {
      acc[cur.user_id] = cur.created_at;
      return acc;
    },
    {} as Record<string, string>,
  );

  const countryMap: Record<string, string> = countryData?.reduce(
    (acc, cur) => {
      acc[cur.id] = cur.country || null;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (data as SupabaseReview[]).map((r) => {
    const user = Array.isArray(r.users) ? r.users[0] : r.users; 
    return {
      id: r.id,
      review: r.review,
      user_id: r.user_id,
      nickname: user?.nickname || '익명 사용자',
      profile_img: user?.profile_img || null,
      purchased_at: purchaseMap[r.user_id] || null, // 구매 정보 추가
      country: countryMap[r.user_id] || null, // 국가 정보 추가

    };
  });
};
