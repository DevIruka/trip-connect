import { Dispatch, SetStateAction, useState } from 'react';

type SearchResultsProps = {
  filteredPosts: ReqResPost[];
  filter : 'all' | 'question' | 'answer'
};

export type ReqResPost = {
  content_html?: string;
  created_at: string;
  free_content?: string | null;
  id: number;
  request_id?: string;
  title: string;
  user_id: string | null;
  verified_country: string | null;
  category: string[] | null;
  content?: string | null;
  country_city?: string;
  credit?: number;
  date_end?: string;
  img_url?: string | null;
};

const SearchResults = ({ filteredPosts, filter }: SearchResultsProps) => {
  
  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return ''; // null 또는 undefined 처리
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  const onClickHandler = (post: ReqResPost) => {
    if (post.request_id) {
      location.href = `/post/${post.request_id}`;
    } else {
      location.href = `/post/${post.id}`;
    }
  };
  const filtered = filteredPosts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'question') return !post.request_id;
    if (filter === 'answer') return !!post.request_id;
    return true;
  });
  return (
    <>
      <ul className="w-full">
        {filtered?.map((post) => (
          <li
            key={post.id}
            className="w-full"
            onClick={() => onClickHandler(post)}
          >
            <div className="flex border-2 rounded-lg p-2 cursor-pointer w-full mb-2">
              {'request_id' in post ? ( // `request_id`가 있으면 RequestPostData로 취급
                <div>
                  <p>답변글</p>
                  <div className="flex flex-row overflow-x-auto">
                    <div className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2">
                      {post.verified_country}
                    </div>
                    <div className="flex flex-row">
                      {post.category?.map((element, i) => {
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2"
                          >
                            {element}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <span>제목 : {post.title}</span>
                </div>
              ) : (
                <div>
                  <p>질문글</p>
                  <div className="flex flex-row overflow-x-auto">
                    <div className="flex flex-row">
                      {post.category?.map((element, i) => {
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2"
                          >
                            {element}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-sm text-[#808080] font-bold">
                    {truncateText(post.content, 20)}
                  </p>
                  {/* <p>크레딧 : {post.credit}</p> */}
                  {/* <p>기한 : {post.date_end}</p> */}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
export default SearchResults;
