import { ExtendedResponsePostData } from '@/app/[locale]/search/[id]/_types/searchTypes';
import { supabase } from '@/utils/supabase/supabaseClient';

type FetchUserResponsePostsResult = {
  user_response_posts: ExtendedResponsePostData[];
  totalCount: number[] | null;
};

export const fetchUserResponsePosts = async (
  user_id: string | null,
  page: number,
  limit: number = 5,
): Promise<FetchUserResponsePostsResult> => {
  const startIndex = (page - 1) * limit;

  const query = supabase
    .from('response_posts')
    .select(
      `
      *,
      request_posts (category, credit, country_city)
    `,
    )
    .eq('user_id', `${user_id}`)
    .range(startIndex, startIndex + limit - 1);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const user_response_posts = data?.map((post) => {
    const { request_posts, ...rest } = post;
    return {
      ...rest,
      category: request_posts?.category || null,
      credit: request_posts?.credit || null,
      country_city: JSON.parse(request_posts?.country_city) || null,
    };
  });

  const responseCountPromises = data?.map(async (post) => {
    const { error: countError, count: responseCount } = await supabase
      .from('response_posts')
      .select('*', { count: 'exact' })
      .eq('id', post.id); // response_posts의 id를 사용하여 count 구하기

    if (countError) {
      console.error(
        'Error fetching response count for post id',
        post.id,
        countError,
      );
      return 0;
    }

    return responseCount || 0;
  });

  const responseCounts = await Promise.all(responseCountPromises);

  console.log(responseCounts);

  return { user_response_posts, totalCount: responseCounts };
};
