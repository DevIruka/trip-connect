import { truncateText } from '@/utils/truncateText';
import Image from 'next/image';
import { ReqResPost } from './SearchResults';
import { UseMutationResult } from '@tanstack/react-query';
import { EnglishCategory, KoreanCategory } from '@/utils/topics';


const bookmarkButton = '/images/bookmark.svg';
const coin = '/images/coin.svg';

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
        <div className="flex flex-row w-full h-[60px] relative">
          <div className="flex flex-row mt-[20px] mb-[16px]">
            <div className="flex items-center justify-center h-[22.017px] min-w-11 bg-[#FFECD4] text-[#FF810B] rounded-md px-[6px] mr-2 my-1">
              {post.country_city}
            </div>
            {post.category?.slice(0, 2).map((element, i) => {
              const koreanCategory = convertToKorean(element);
              return (
                <div
                  key={i}
                  className="flex items-center justify-center h-[22.017px] min-w-11 bg-[#F5F7FA] text-[#45484D] rounded-md px-[6px] mr-2 my-1"
                >
                  {koreanCategory}
                </div>
              );
            })}
            <div className="absolute right-0 top-6">
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
        <div className="flex flex-row items-start">
          <p className="text-[16px] font-[600] pt-[1px] text-[#0582FF]">Q.</p>
          <div>
            <p className="max-w-[315px] text-[16px] text-lg font-bold ml-[6px] overflow-hidden text-ellipsis">
              {post.title}
            </p>
            <p className="text-[14px] max-w-[315px] text-[#797C80] font-[500] ml-[6px] overflow-hidden text-ellipsis">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center my-2">
          <Image width={18} height={18} src={coin} alt="credit icon" />
          <p className="text-[12px] text-[#797C80] ml-1">{post.credit} C</p>
        </div>
      </div>
    </>
  );
};
export default RequestDetail;
