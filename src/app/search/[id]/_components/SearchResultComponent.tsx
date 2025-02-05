'use client';

import { decodeUrl } from '@/utils/decodeUrl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  ExtendedResponsePostData,
  Params,
  RequestPostData,
} from '../_types/searchTypes';
import { KoreanCategory, topicMapping } from '@/utils/topics';
import SearchResults, { ReqResPost } from './SearchResults';
import DetailedSearchBar from './DetailedSearchBar';
import SearchResultCount from './SearchResultCount';
import CustomSelectBox from './SelectBox';
import useInfinitePosts from '@/utils/api/tanstack/search/useInfinitySearchPosts';
import { useTranslation } from 'react-i18next';
export type Post = ExtendedResponsePostData | RequestPostData;

const SearchResultComponent = () => {
  const { id } = useParams<Params>();
  const keyword = decodeUrl(id);
  const { t } = useTranslation('search');
  const [noResults, setNoResults] = useState<boolean>(false);
  const [countReq, setCountReq] = useState<number | null>(0);
  const [countRes, setCountRes] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<
    KoreanCategory | '전체'
  >('전체');
  const route = useRouter();
  const [filter, setFilter] = useState<'all' | 'question' | 'answer'>('all');

  const inputOnclick = () => {
    route.push('/search');
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinitePosts(keyword, setCountReq, setCountRes, setNoResults);

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) || [],
    [data],
  );

  const moreBtnHandler = async () => {
    await fetchNextPage();
  };

  const filteredPosts: ReqResPost[] =
    selectedCategory === '전체' || !selectedCategory
      ? posts
      : posts?.filter(
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
      <div className="h-full w-full mx-auto relative px-5 md:px-1 overflow-y-scroll; menuscrollbar">
        {noResults && (
          <div className="flex justify-center items-center mt-[40px]">
            <p className="text-[16px] font-[600] text-[#797C80]">
              {t('search.no_results', { keyword })}
            </p>
          </div>
        )}
        {!noResults && (
          <>
            {countReq! + countRes! !== 0 ? (
              <div className="flex max-w-[1200px] mx-auto justify-between mt-[20px] mb-[16px]">
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
              {hasNextPage && (
                <button
                  onClick={() => moreBtnHandler()}
                  disabled={isFetchingNextPage}
                  className="border rounded-[100px] p-2 grid cursor-pointer w-full max-w-[324px]"
                >
                  {isFetchingNextPage ? t('loading') : t('more')}
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
