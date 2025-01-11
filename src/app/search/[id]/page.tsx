'use client';

import { decodeUrl } from '@/utils/decodeUrl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoMdCloseCircle } from 'react-icons/io';
import { Params } from './_types/searchTypes';
import useInfiniteSearchPosts from '@/utils/api/tanstack/useInfiniteSearchRequestPosts';
import { category, categoryMapping } from '@/data/category';

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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchedRequestPost,
  } = useInfiniteSearchPosts(keyword!, setNoResults);

  const filteredPosts =
    selectedCategory === 'all' || !selectedCategory
      ? searchedRequestPost
      : searchedRequestPost?.filter(
          (post) =>
            Array.isArray(post.category) &&
            post.category.includes(selectedCategory),
        );

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Link href="/">
          <IoIosArrowBack size={30} />
        </Link>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          ref={inputRef}
          className="border border-black rounded-full h-8 w-72 mt-1 mb-1 px-4"
          onClick={inputOnclick}
        />
        <button type="button" className="absolute right-14 top-2">
          <IoMdCloseCircle size={25} />
        </button>
        <Link href="/">
          <span className="mr-1">닫기</span>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex m-1 w-11/12 overflow-y-scroll scrollbar-hide">
          <div className="flex flex-row justify-center items-center">
            {category.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category ? null : category,
                  )
                }
                className={`w-16 h-10 mx-1 rounded-full border ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200'
                }`}
              >
                <span className="text-s">{categoryMapping[category]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="inner">
        {noResults && <p>{keyword}에 대한 검색 결과가 존재하지 않습니다.</p>}
        {!noResults && (
          <>
            <ul>
              {filteredPosts?.map((post) => (
                <li key={post.id} className="w-full">
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
              {!hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="border"
                >
                  {isFetchingNextPage
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
