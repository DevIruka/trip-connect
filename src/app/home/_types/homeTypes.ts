export type nation = {
  continent: string;
  country: string;
  city: string;
};

type countries = {
  name: string;
  cities: string[];
};

export type nations = {
  continent: string;
  countries: countries[];
};

// 게시물 데이터 타입 정의
export type Post = {
  created_at: string;
  id: string | number;
  title: string;
  user_id: string;

  category?: string[] | null;
  content?: string;
  country_city?: string;
  credit?: number;
  date_end?: string | null;
  img_url?: string | null;

  content_html?: string;
  free_content?: string;
  request_id?: string;
  request_posts?: { category: string[]; credit: number };
  verified_country?: string | null;
  users?: { nickname: string };
  translated_title?: string | null;
  translated_free_content?: string;
  translated_content?: string | null;
};
