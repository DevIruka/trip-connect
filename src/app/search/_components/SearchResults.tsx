import { useUserStore } from '@/store/userStore';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';
// import bookmarkButton from '@/images/bookmark.svg';
import Image from 'next/image';

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

const bookmarkButton = '/images/bookmark.svg';

const SearchResults = ({ filteredPosts, filter }: SearchResultsProps) => {
  const { user } = useUserStore();
  const userId = user ? user.id : '';

  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);

  const { isPostBookmarked } = useBookmarks(userId);

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

  const reverseTopicMapping = Object.fromEntries(
    Object.entries(topicMapping).map(([key, value]) => [value, key])
  );
  
  function convertToKorean(english: EnglishCategory): KoreanCategory {
    return reverseTopicMapping[english] as KoreanCategory
  }
  
  return (
    <>
      <ul className="w-full">
        {filtered?.map((post) => {
          const bookmarked = isPostBookmarked(String(post.id));
          return (
            <li
              key={post.id}
              className="w-full"
              onClick={() => onClickHandler(post)}
            >
              <div className="flex border-2 rounded-lg p-2 cursor-pointer w-full mb-2">
                {'request_id' in post ? ( // `request_id`가 있으면 RequestPostData로 취급
                  <div className="w-full">
                    <p className="font-bold">답변글</p>
                    <div className="flex flex-row">
                      <div className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2 my-1">
                        {post.verified_country}
                      </div>
                      <div className="flex flex-row">
                        {post.category?.slice(0, 3).map((element, i) => {
                          const koreanCategory = convertToKorean(element)
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
                    <span className="text-lg font-bold">{post.title}</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="font-bold">질문글</p>
                    <div className="flex flex-row w-full relative">
                      <div className="flex flex-row">
                        {post.category?.slice(0, 3).map((element, i) => {
                          const koreanCategory = convertToKorean(element)
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2 my-1"
                            >
                              {koreanCategory}
                            </div>
                          );
                        })}
                        <div className="absolute right-0">
                          {bookmarked ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBookmarkMutation.mutate(String(post.id));
                              }}
                            >
                              <Image
                                width={20}
                                height={20}
                                src={bookmarkButton}
                                alt="bookmark button"
                                className="brightness-0 z-0"
                              />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addBookmarkMutation.mutate(String(post.id));
                              }}
                            >
                              <Image
                                width={20}
                                height={20}
                                src={bookmarkButton}
                                alt="bookmark button"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-sm text-[#808080] font-bold">
                      {truncateText(post.content, 20)}
                    </p>
                  </div>
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
