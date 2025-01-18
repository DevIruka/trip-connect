import Image from 'next/image';
import { ReqResPost } from './SearchResults';
import { UseMutationResult } from '@tanstack/react-query';
import TimeAgo from './TimeAgo';
import bookmarkButton from '@/data/images/bookmark.svg';
import { calculateDDay } from '../../_utils/calculateDDay';
import { convertToKorean } from '../../_utils/convertTopictoKorean';

const borderbookmarkButton = '/images/ic-bookmark.svg';
const coin = '/images/coin.svg';
const marker = '/images/ic-location.svg';

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
  responseCount: number | string | null;
};

const RequestDetail = ({
  post,
  bookmarked,
  deleteBookmarkMutation,
  addBookmarkMutation,
  responseCount,
}: RequestDetailProps) => {
  console.log(post.date_end);
  return (
    <>
      <div className="w-full">
        <div className="flex flex-row w-full">
          <div className="flex flex-row w-full items-center justify-between mt-[12px] mb-[12.99px]">
            <div className="flex flex-row items-center justify-center">
              <div className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#FFECD4] text-[#FF810B] rounded-md py-[4px] px-[6px] mr-2">
                <p className="text-[12px]">{calculateDDay(post.date_end)}</p>
              </div>
              <div className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-2">
                <Image src={marker} width={10} height={10} alt="marker" />
                <p className="text-[12px]">{post.country_city}</p>
              </div>
              {post.category?.slice(0, 2).map((element, i) => {
                const koreanCategory = convertToKorean(element);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center h-[22.017px] min-w-8 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-2"
                  >
                    <p className="text-[12px]">{koreanCategory}</p>
                  </div>
                );
              })}
            </div>

            {bookmarked ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBookmarkMutation.mutate(String(post.id));
                }}
              >
                <Image
                  width={24}
                  height={24}
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
                  width={24}
                  height={24}
                  src={borderbookmarkButton}
                  alt="bookmark button"
                  className=""
                />
              </button>
            )}
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

        <div className="flex flex-row items-center mt-[18px] mb-[26px] justify-between">
          <div className="flex flex-row items-center">
            <Image width={18} height={18} src={coin} alt="credit icon" />
            <p className="text-[12px] text-[#797C80] ml-1">{post.credit} C</p>
            {responseCount && Number(responseCount) !== 0 ? (
              <p className="text-[12px] text-[#797C80] ml-1">
                · {responseCount}명 답변
              </p>
            ) : null}
          </div>
          <div>
            <TimeAgo createdAt={post.created_at} />
          </div>
        </div>
      </div>
    </>
  );
};
export default RequestDetail;
