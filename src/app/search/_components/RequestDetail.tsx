import { truncateText } from '@/utils/truncateText';
import Image from 'next/image';
import { ReqResPost } from './SearchResults';
import { UseMutationResult } from '@tanstack/react-query';
import { EnglishCategory, KoreanCategory } from '@/utils/topics';

const bookmarkButton = '/images/bookmark.svg';
const q = '/images/q.png';
const star = '/images/star.png';

type RequestDetailProps = {
  post: ReqResPost;
  bookmarked: boolean;
  deleteBookmarkMutation: UseMutationResult<
    void,
    Error,
    string | number,
    unknown
  >;
  addBookmarkMutation: UseMutationResult<
    unknown,
    Error,
    string | number,
    unknown
  >;
  convertToKorean: (english: EnglishCategory) => KoreanCategory;
};

const RequestDetail = ({
  post,
  bookmarked,
  deleteBookmarkMutation,
  addBookmarkMutation,
  convertToKorean,
}: RequestDetailProps) => {
  return (
    <>
      <div className="w-full">
        <div className="flex flex-row w-full relative">
          <Image
            width={35}
            height={35}
            src={q}
            alt="question"
            className="mr-1"
          />
          <div className="flex flex-row">
            <div className="flex items-center justify-center min-w-11 bg-[#F7F7FB] rounded-md px-1 mr-2 my-1">
              {post.country_city}
            </div>
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
        <p className="text-sm text-gray-400">마감일 | {post.date_end}</p>
        <p className="text-lg font-bold mb-2">{post.title}</p>
        <p className="text-sm text-gray-400 font-bold">
          {truncateText(post.content, 20)}
        </p>
        <div className="flex flex-row items-center my-2">
          <Image width={20} height={20} src={star} alt="bookmark button" />
          <p className="text-xs text-gray-400 ml-1">{post.credit} C</p>
        </div>
      </div>
    </>
  );
};
export default RequestDetail;
