import { EnglishCategory, KoreanCategory } from '@/utils/topics';

export type RequestPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: EnglishCategory[] | null | KoreanCategory[];
  img_url: string[];
  type: 'question';
  user_id: string;
  date_end?: string | null;
  credit?: number | null;
  created_at: string;
};

export type ResponsePost = {
  id: string;
  title: string;
  content_html: string;
  free_content: string;
  verified_country: string | null;
  category: EnglishCategory[] | null | KoreanCategory[];
  img_url: string[];
  type: 'answer';
  request_id: string;
  created_at: string;
  user_id?: string;
  translated_title?: string;
  translated_free_content?: string;
  translated_content?: string;
};

export type UnifiedPost = RequestPost | ResponsePost;
