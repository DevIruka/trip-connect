'use client';

import { decodeUrl } from '@/utils/decodeUrl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useInfiniteSearchRequestPosts from '@/utils/api/tanstack/search/useInfiniteSearchRequestPosts';
import useInfiniteSearchResponsePosts from '@/utils/api/tanstack/search/useInfiniteSearchResponsePosts';
import { ExtendedResponsePostData, Params, RequestPostData } from '../_types/searchTypes';
import { KoreanCategory, topicMapping } from '@/utils/topics';
import SearchResults, { ReqResPost } from './SearchResults';
import DetailedSearchBar from './DetailedSearchBar';
import SearchResultCount from './SearchResultCount';
import CustomSelectBox from './SelectBox';
export type Post = ExtendedResponsePostData | RequestPostData;

const SearchResultComponent = () => {
  const { id } = useParams<Params>();
  const keyword = decodeUrl(id);
  const [noReqResults, setNoReqResults] = useState<boolean>(false);
  const [countReq, setCountReq] = useState<number | null>(0);
  const [countRes, setCountRes] = useState<number | null>(0);
  const [noResResults, setNoResResults] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    KoreanCategory | '전체'
  >('전체');
  const route = useRouter();
  const [allPosts, setAllPosts] = useState<ReqResPost[] | []>([]);
  const [filter, setFilter] = useState<'all' | 'question' | 'answer'>('all');

  const inputOnclick = () => {
    route.push('/search');
  };

  const {
    searchedRequestPost,
    requestFetchNextPage,
    requestHasNextPage,
    requestIsFetchingNextPage,
  } = useInfiniteSearchRequestPosts(keyword!, setNoReqResults, setCountReq);

  const {
    searchedResponsePost,
    responseFetchNextPage,
    responseHasNextPage,
    responseIsFetchingNextPage,
  } = useInfiniteSearchResponsePosts(keyword!, setNoResResults, setCountRes);

  const moreBtnHandler = async () => {
    await requestFetchNextPage();
    await responseFetchNextPage();
  };

  useEffect(() => {
    if (searchedRequestPost) {
      setAllPosts((prevPosts) => {
        const newPosts = [...prevPosts, ...searchedRequestPost];
        // 중복된 ID를 가진 포스트를 필터링
        return newPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id),
        );
      });
    }
  }, [searchedRequestPost]);

  useEffect(() => {
    if (searchedResponsePost) {
      setAllPosts((prevPosts) => {
        const newPosts = [...prevPosts, ...searchedResponsePost];
        // 중복된 ID를 가진 포스트를 필터링
        return newPosts.filter(
          (post, index, self) =>
            index === self.findIndex((p) => p.id === post.id),
        );
      });
    }
  }, [searchedResponsePost]);

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredPosts: ReqResPost[] =
    selectedCategory === '전체' || !selectedCategory
      ? sortedPosts
      : sortedPosts?.filter(
          (post) =>
            Array.isArray(post.category) &&
            post!.category.includes(topicMapping[selectedCategory]),
        );

  return (
    <>
      <DetailedSearchBar
        inputOnclick={inputOnclick}
        keyword={keyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="inner menuscrollbar">
        {noReqResults && noResResults && (
          <div className="flex justify-center items-center mt-[40px]">
            <p className="text-[16px] font-[600] text-[#797C80]">{keyword}에 대한 검색 결과가 존재하지 않습니다.</p>
          </div>
        )}
        {!(noReqResults && noResResults) && (
          <>
            {countReq! + countRes! !== 0 ? (
              <div className="flex justify-between mt-[20px] mb-[16px]">
                <SearchResultCount
                  countReq={countReq}
                  countRes={countRes}
                  filter={filter}
                />
                <CustomSelectBox filter={filter} setFilter={setFilter} />
              </div>
            ) : (
              <p></p>
            )}
            <SearchResults filteredPosts={filteredPosts} filter={filter} />
            <div className="flex flex-col w-full items-center justify-center mt-[40px]">
              {(requestHasNextPage || responseHasNextPage) && (
                <button
                  onClick={() => moreBtnHandler()}
                  disabled={
                    requestIsFetchingNextPage || responseIsFetchingNextPage
                  }
                  className="border rounded-[100px] p-2 grid cursor-pointer w-full max-w-[324px]"
                >
                  {requestIsFetchingNextPage || responseIsFetchingNextPage
                    ? '검색 결과 로드 중'
                    : '더보기'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchResultComponent;
