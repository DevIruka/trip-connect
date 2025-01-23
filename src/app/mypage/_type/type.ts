export type RequestPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
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
  category: string[];
  img_url: string[];
  type: 'answer';
  request_id: string;
  created_at: string;
  user_id?: string;
};

export type UnifiedPost = RequestPost | ResponsePost;
