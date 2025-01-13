'use client';

import { decodeUrl } from '@/utils/decodeUrl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Params } from './_types/searchTypes';
import useInfiniteSearchRequestPosts from '@/utils/api/tanstack/search/useInfiniteSearchRequestPosts';
import useInfiniteSearchResponsePosts from '@/utils/api/tanstack/search/useInfiniteSearchResponsePosts';
import DetailedSearchBar from '../_components/DetailedSearchBar';

const SearchResultPage = () => {
  const { id } = useParams<Params>();
  const keyword = decodeUrl(id);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // 초기값 null로 설정
  const route = useRouter();

  useEffect(() => {
    if (keyword && inputRef.current) {
      inputRef.current.value = keyword; // input 엘리먼트의 value를 업데이트
    }
  }, [keyword]);

  const inputOnclick = () => {
    route.push('/search');
  };

  const {
    searchedRequestPost,
    requestFetchNextPage,
    requestHasNextPage,
    requestIsFetchingNextPage,
  } = useInfiniteSearchRequestPosts(keyword!, setNoResults);

  // const {fetchNextPage, hasNextPage, isFetchingNextPage, searchedRequestPost} = useInfiniteSearchResponsePosts(keyword!, setNoResults);

  const filteredPosts =
    selectedCategory === 'all' || !selectedCategory
      ? searchedRequestPost
      : searchedRequestPost?.filter(
          (post) =>
            Array.isArray(post.category) &&
            post.category.includes(selectedCategory),
        );

  console.log(filteredPosts);

  return (
    <>
      <DetailedSearchBar
        inputOnclick={inputOnclick}
        inputRef={inputRef}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="inner">
        {noResults && <p>{keyword}에 대한 검색 결과가 존재하지 않습니다.</p>}
        {!noResults && (
          <>
            <ul>
              {filteredPosts?.map((post) => (
                <li
                  key={post.id}
                  className="w-full"
                  onClick={() => {
                    location.href = post.id
                      ? `/post/${post.id}`
                      : `/post/${post.id}`;
                  }}
                >
                  <div className="border-2 flex flex-col cursor-pointer">
                    <span>제목 : {post.title}</span>
                    <p>내용 : {post.content}</p>
                    <p>크레딧 : {post.credit}</p>
                    <p>기한 : {post.date_end}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center justify-center p-3">
              {!requestHasNextPage && (
                <button
                  onClick={() => requestFetchNextPage()}
                  disabled={requestIsFetchingNextPage}
                  className="border"
                >
                  {requestIsFetchingNextPage
                    ? '검색 결과 로드 중'
                    : '검색 결과 더보기'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchResultPage;
