'use client';

import { decodeUrl } from '@/utils/decodeUrl';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack, IoMdCloseCircle } from 'react-icons/io';

const PAGE_SIZE = 7;

type Params = {
  id: string;
};

type PostData = {
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
  const fetchPosts = async ({ pageParam = 0 }) => {
    const from = pageParam * PAGE_SIZE; // 시작 인덱스
    const to = from + PAGE_SIZE - 1; // 끝 인덱스

    const query = supabase
      .from('request_posts')
      .select('*')
      .ilike('title', `%${keyword}%`)
      .range(from, to);

    const { data: searched_request_posts, error } = await query;

    if (error) throw new Error(error.message);
    if (searched_request_posts?.length === 0 && pageParam === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
    return {
      data: searched_request_posts || [],
      nextPage:
        searched_request_posts.length === PAGE_SIZE ? pageParam + 1 : null, // 다음 페이지가 있는지 여부
    };
  };

  const {
    data: searchedRequestPost,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['searched request post', keyword],
    queryFn: ({ pageParam = 0 }) => fetchPosts({ pageParam, keyword }),
    getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 반환
    onError: (err: Error) => {
      console.error('Error fetching posts:', err);
    },
  });
  const requestPosts =
    searchedRequestPost?.pages.flatMap((page) => page.data) || [];

  const filteredPosts = selectedCategory
    ? requestPosts.filter(
        (post) =>
          Array.isArray(post.category) &&
          post.category.includes(selectedCategory),
      )
    : requestPosts;
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
      <div className="flex gap-2 m-2">
        {['food', 'place', 'other'].map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory((prev) =>
                prev === category ? null : category,
              )
            }
            className={`px-4 py-2 border ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="inner">
        {noResults && <p>{keyword}에 대한 검색 결과가 존재하지 않습니다.</p>}
        {!noResults && (
          <>
            <ul>
              {filteredPosts.map((post) => (
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
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? '검색 결과 로드 중' : '검색 결과 더보기'}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchResultPage;
