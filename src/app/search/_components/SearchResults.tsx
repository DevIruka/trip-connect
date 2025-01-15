import { useUserStore } from '@/store/userStore';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';
// import bookmarkButton from '@/images/bookmark.svg';
import Image from 'next/image';
import RequestDetail from './RequestDetail';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserNicknames } from '@/utils/api/tanstack/search/useUserNickNames';

type SearchResultsProps = {
  filteredPosts: ReqResPost[];
  filter: 'all' | 'question' | 'answer';
};

export type ReqResPost = {
  content_html?: string;
  created_at: string;
  free_content?: string | null;
  id: string | number;
  request_id?: string;
  title: string;
  user_id: string | null;
  verified_country: string | null;
  category: EnglishCategory[] | null;
  content?: string | null;
  country_city?: string;
  credit?: number;
  date_end?: string;
  img_url?: string | null;
};

const a = '/images/a.png';

const SearchResults = ({ filteredPosts, filter }: SearchResultsProps) => {
  const { user } = useUserStore();
  const userId = user ? user.id : '';

  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);

  const { isPostBookmarked } = useBookmarks(userId);

  const onClickHandler = (post: ReqResPost) => {
    if (post.request_id) {
      location.href = `/post/${post.request_id}`;
    } else {
      location.href = `/post/${post.id}`;
    }
  };

  const userIds = filteredPosts
    .map((post) => post.user_id)
    .filter((userId) => userId); // null 제외

  const { data: nicknameMap, isLoading, isError } = useUserNicknames(userIds);

  const filtered = filteredPosts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'question') return !post.request_id;
    if (filter === 'answer') return !!post.request_id;
    return true;
  });

  const reverseTopicMapping = Object.fromEntries(
    Object.entries(topicMapping).map(([key, value]) => [value, key]),
  );

  const convertToKorean = (english: EnglishCategory): KoreanCategory =>
    reverseTopicMapping[english] as KoreanCategory;

  return (
    <>
      <ul className="w-full">
        {filtered?.map((post) => {
          const bookmarked = isPostBookmarked(String(post.id));
          const nickname = nicknameMap?.[post.user_id!];
          return (
            <li
              key={post.id}
              className="w-full"
              onClick={() => onClickHandler(post)}
            >
              <div className="flex border-b-4 p-2 cursor-pointer w-full mb-2">
                {'request_id' in post ? ( // `request_id`가 있으면 RequestPostData로 취급
                  <div className="w-full">
                    <div className="flex flex-row">
                      <Image
                        width={35}
                        height={35}
                        src={a}
                        alt="answer"
                        className="mr-1"
                      />
                      <div className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2 my-1">
                        {post.verified_country}
                      </div>
                      <div className="flex flex-row">
                        {post.category?.slice(0, 2).map((element, i) => {
                          const koreanCategory = convertToKorean(element);
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2 my-1"
                            >
                              {koreanCategory}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      {isLoading ? (
                        <p className="text-sm text-gray-400">닉네임 로딩 중</p>
                      ) : isError ? (
                        <p className="text-sm text-gray-400">
                          닉네임 로딩 중 오류 발생
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">{nickname}</p>
                      )}
                    </div>
                    <span className="text-lg font-bold">{post.title}</span>
                  </div>
                ) : (
                  <RequestDetail
                    addBookmarkMutation={addBookmarkMutation}
                    bookmarked={bookmarked}
                    convertToKorean={convertToKorean}
                    deleteBookmarkMutation={deleteBookmarkMutation}
                    post={post}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default SearchResults;
