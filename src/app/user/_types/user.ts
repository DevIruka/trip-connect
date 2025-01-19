export type UserData = {
    profile_img: string;
    nickname: string;
    country_verified: string;
    introduction: string;
  };
  
  export type UserPost = {
    id: string;
    title: string;
    content: string;
    content_html?: string;
  };
  
  export type UserPostData = {
    responses: UserPost[];
    requests: UserPost[];
    reviews: UserPost[];
  };
  