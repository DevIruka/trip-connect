import Image from 'next/image';

import ResponseContent from './ResponseContent';
import TimeAgo from './TimeAgo';
import { ReqResPost } from './SearchResults';
import { convertToKorean } from '../../_utils/convertTopictoKorean';

type ResponseDetailProps = {
  post: ReqResPost;
  isLoading: boolean;
  isError: boolean;
  nickname: string | undefined;
  reviewCount: number | null;
  credit: number;
};

const coin = '/images/coin.svg';
const marker = '/images/ic-location.svg';

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
      <div className="flex flex-row w-full">
        <div className="flex flex-row w-full items-center mt-[12px] mb-[12.99px]">
          <div className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-2">
            <Image src={marker} width={10} height={10} alt="marker" />
            <p className="text-[12px]">{post.verified_country}</p>
          </div>
          <div className="flex flex-row">
            {post.category?.slice(0, 3).map((element, i) => {
              const koreanCategory = convertToKorean(element);
              return (
                <div
                  key={i}
                  className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-2"
                >
                  <p className="text-[12px]">{koreanCategory}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start">
        <p className="text-[16px] font-[600] pt-[1px] text-[#FA505B]">A.</p>
        <div>
          <p className="max-w-[315px] text-[16px] font-bold ml-[6px] overflow-hidden text-ellipsis">
            {post.title}
          </p>
          <ResponseContent html={post.free_content!} />
        </div>
      </div>

      <div className="flex flex-row items-center mt-[14px] mb-[26px] justify-between">
        <div className="flex flex-row items-center">
          <Image width={18} height={18} src={coin} alt="credit icon" />
          <p className="text-[12px] text-[#797C80] ml-1">{credit} C</p>
          <p className="text-[12px] text-[#797C80] mx-[6px]">·</p>
          {isLoading ? (
            <p className="text-[12px] text-[#797C80] ml-1">닉네임 로딩 중</p>
          ) : isError ? (
            <p className="text-[12px] text-[#797C80] ml-1">
              닉네임 로딩 중 오류 발생
            </p>
          ) : (
            <p className="text-[12px] text-[#797C80]">
              작성자{' '}
              <span className="text-[12px] text-[#797C80] font-[700]">
                {nickname}
              </span>
            </p>
          )}
          {reviewCount && Number(reviewCount) !== 0 ? (
            <>
              <p className="text-[12px] text-[#797C80] mx-[6px]">·</p>
              <p className="text-[12px] text-[#797C80]">
                댓글 {reviewCount}
              </p>
            </>
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
