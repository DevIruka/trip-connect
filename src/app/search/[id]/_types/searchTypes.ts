export type Params = {
  id: string;
};

export type PostData = {
  category: string;
  content: string | null;
  country_city: string;
  created_at: string;
  credit: number;
  date_end: string;
  id: string;
  img_url: JSON | null;
  title: string;
  user_id: string;
};

export type FetchPostsResult = {
  data: PostData[]; // 개별 데이터 배열
  nextPage: number | null; // 다음 페이지 번호
};
