import { useUserStore } from '@/store/userStore';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import { EnglishCategory } from '@/utils/topics';
import { useUserNicknames } from '@/utils/api/tanstack/search/useUserNickNames';
import {
  useResponseCounts,
  useReviewCounts,
} from '@/utils/api/tanstack/search/useResponseCounts';
import { useCredit } from '@/utils/api/tanstack/search/useCredit';
import ResponseDetail from './ResponseDetail';
import RequestDetail from './RequestDetail';

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

  const postIds = filteredPosts
    .map((post) => post.id)
    .filter((postId) => postId); // null 제외

  const requestIds = filteredPosts
    .map((post) => post.request_id)
    .filter((requestIds) => requestIds); // null 제외

  const { data: nicknameMap, isLoading, isError } = useUserNicknames(userIds);
  const responseCounts = useResponseCounts(postIds);
  const creditResults = useCredit(requestIds);
  const reviewCounts = useReviewCounts(postIds);

  const filtered = filteredPosts.filter((post) => {
    if (filter === 'all') return true;
    if (filter === 'question') return !post.request_id;
    if (filter === 'answer') return !!post.request_id;
    return true;
  });

  return (
    <>
      <ul className="w-full">
        {filtered?.map((post, index) => {
          const bookmarked = isPostBookmarked(String(post.id));
          const nickname = nicknameMap?.[post.user_id!];
          const responseCount =
            responseCounts[index]?.data !== undefined
              ? responseCounts[index]?.data
              : 0;
          const reviewCount =
            reviewCounts[index]?.data !== undefined
              ? reviewCounts[index]?.data
              : 0;
          const credit: number =
            Array.isArray(creditResults[index]?.data) &&
            creditResults[index]?.data.length > 0
              ? creditResults[index]?.data[0]?.credit
              : 0;
          return (
            <li
              key={post.id}
              className="w-full"
              onClick={() => onClickHandler(post)}
            >
              <div className="flex border-b-2 border-[#F4F4F4] cursor-pointer w-full">
                {'request_id' in post ? (
                  <ResponseDetail
                    credit={credit}
                    isError={isError}
                    isLoading={isLoading}
                    nickname={nickname}
                    post={post}
                    reviewCount={reviewCount}
                  />
                ) : (
                  <RequestDetail
                    addBookmarkMutation={addBookmarkMutation}
                    bookmarked={bookmarked}
                    deleteBookmarkMutation={deleteBookmarkMutation}
                    post={post}
                    responseCount={responseCount}
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
