import { Database, Tables } from '@/types/supabase';

import { EnglishCategory } from '@/utils/topics';
import { ReqResPost } from '../_components/SearchResults';

export type Params = {
  id: string;
};

export type RequestPostData =
  Database['public']['Tables']['request_posts']['Row'];

export type FetchRequestPostsResult = {
  data: ReqResPost[]; // 개별 데이터 배열
  nextPage: number | null; // 다음 페이지 번호
};

export type ResponsePostData =
  Database['public']['Tables']['response_posts']['Row'];

export type ExtendedResponsePostData = ResponsePostData & {
  category: EnglishCategory[] | null;
};

export type FetchResponsePostsResult = {
  data: ExtendedResponsePostData[]; // 개별 데이터 배열
  nextPage: number | null; // 다음 페이지 번호
};

export type FetchReviewResult = {
  data: (Tables<'reviews'> & {
    response_posts: Tables<'response_posts'>;
    users: Tables<'users'>;
    purchased_user_created_at : string | null
  })[];
  nextPage: number | null; // 다음 페이지 번호
};
