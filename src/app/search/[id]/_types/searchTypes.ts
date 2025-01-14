import { Database } from '@/types/supabase';
import { ReqResPost } from '../../_components/SearchResults';

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
  Database['public']['Tables']['response_posts']['Row']

export type ExtendedResponsePostData = ResponsePostData & {
  category: string[] | null;
};

export type FetchResponsePostsResult = {
  data: ExtendedResponsePostData[]; // 개별 데이터 배열
  nextPage: number | null; // 다음 페이지 번호
};
