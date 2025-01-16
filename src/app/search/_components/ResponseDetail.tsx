import Image from 'next/image';
import { convertToKorean } from '../_utils/convertTopictoKorean';
import ResponseContent from './ResponseContent';
import TimeAgo from './TimeAgo';
import { ReqResPost } from './SearchResults';

type ResponseDetailProps = {
  post: ReqResPost;
  isLoading: boolean;
  isError: boolean;
  nickname: string | undefined;
  reviewCount: number | null;
  credit: number;
};

const coin = '/images/coin.svg';

const ResponseDetail = ({
  post,
  isLoading,
  isError,
  nickname,
  reviewCount,
  credit,
}: ResponseDetailProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-row mt-[20px] mb-[16px]">
        <div className="flex items-center justify-center h-[22.017px] min-w-11 bg-[#FFECD4] text-[#FF810B] rounded-md px-[6px] mr-2 my-1">
          {post.verified_country}
        </div>
        <div className="flex flex-row">
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
        </div>
      </div>

      <div className="flex flex-row items-start">
        <p className="text-[16px] font-[600] pt-[1px] text-[#9705FF]">A.</p>
        <div>
          <p className="max-w-[315px] text-[16px] text-lg font-bold ml-[6px] overflow-hidden text-ellipsis">
            {post.title}
          </p>
          <ResponseContent html={post.free_content!} />
        </div>
      </div>

      <div className="flex flex-row items-center my-2 justify-between">
        <div className="flex flex-row items-center">
          <Image width={18} height={18} src={coin} alt="credit icon" />
          <p className="text-[12px] text-[#797C80] ml-1">{credit} C ·</p>
          {isLoading ? (
            <p className="text-[12px] text-[#797C80] ml-1">닉네임 로딩 중</p>
          ) : isError ? (
            <p className="text-[12px] text-[#797C80] ml-1">
              닉네임 로딩 중 오류 발생
            </p>
          ) : (
            <p className="text-[12px] text-[#797C80] ml-1">
              작성자{' '}
              <span className="text-[12px] text-[#797C80] font-[700]">
                {nickname}
              </span>
            </p>
          )}
          {reviewCount && Number(reviewCount) !== 0 ? (
            <p className="text-[12px] text-[#797C80] ml-1">
              · 댓글 {reviewCount}
            </p>
          ) : null}
        </div>
        <div>
          <TimeAgo createdAt={post.created_at} />
        </div>
      </div>
    </div>
  );
};
export default ResponseDetail;
