export type UserData = {
  profile_img: string;
  nickname: string;
  country_verified: null | boolean;
  introduction: string;
  country: string;
};

export type ResponsePost = {
  id: string;
  title: string;
  free_content: string;
  request_id: string;
  created_at: string;
  request_posts: {
    country_city: string;
    category: string;
    credit: number;
    user_id: string;
  };
  user_nickname: string;
  comment_count: number;
};

export type UserPostData = {
  responses: ResponsePost[];
  requests: RequestPost[];
  reviews: ReviewPost[];
};

export type RequestPost = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  date_end: string;
  credit: number;
  created_at: string;
};

export type ReviewPost = {
  id: string;
  review: string;
  user_id: string;
  response_id: string;
  purchasedAt?: string | null;
};
