import Image from 'next/image';

import ResponseContent from './ResponseContent';
import TimeAgo from './TimeAgo';
import { ReqResPost } from './SearchResults';
import { convertToKorean } from '../../_utils/convertTopictoKorean';
import { useLang } from '@/store/languageStore';
import { useTranslation } from 'react-i18next';
import { countryNameMapping } from '@/data/nation';
import { capitalizeFirstLetter } from '../../_utils/capitalize';

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
  const { lang } = useLang();
  const { t } = useTranslation('search');
  return (
    <div className="w-full ">
      <div className="flex flex-row w-full ">
        <div className="flex flex-row w-full items-center mt-[12px] mb-[12px] md:mt-0 ">
          <div className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-[4px] ">
            <Image src={marker} width={10} height={10} alt="marker" />
            <p className="text-[12px]">
              {typeof post.country_city === 'string'
                ? ''
                : lang === 'en'
                ? countryNameMapping[post.country_city?.country || '']
                : post.country_city?.country}
            </p>
          </div>
          <div className="flex flex-row">
            {post.category?.slice(0, 3).map((element, i) => {
              const koreanCategory = convertToKorean(element);
              return (
                <div
                  key={i}
                  className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] mr-[4px]"
                >
                  <p className="text-[12px]">
                    {lang === 'en' ? capitalizeFirstLetter(element) : koreanCategory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start">
        <p className="text-[16px] font-[600] text-[#FA505B]">A.</p>
        <div>
          <p className="max-w-[295px] text-[16px] font-bold ml-[6px] mb-[6px] overflow-hidden text-ellipsis">
            {post.title}
          </p>
          <ResponseContent html={post.free_content!} />
        </div>
      </div>

      <div className="flex flex-row items-center mt-[12px] mb-[24px] md:mb-0 justify-between">
        <div className="flex flex-row items-center">
          <Image width={18} height={18} src={coin} alt="credit icon" />
          <p className="text-[12px] text-[#797C80] ml-1">{credit} </p>
          <p className="text-[12px] text-[#797C80] mx-[6px]">·</p>
          {isLoading ? (
            <p className="text-[12px] text-[#797C80] ml-1">닉네임 로딩 중</p>
          ) : isError ? (
            <p className="text-[12px] text-[#797C80] ml-1">
              닉네임 로딩 중 오류 발생
            </p>
          ) : (
            <p className="text-[12px] text-[#797C80]">
              {t('writer')}{' '}
              <span className="text-[12px] text-[#797C80] font-[700]">
                {nickname}
              </span>
            </p>
          )}
          {reviewCount && Number(reviewCount) !== 0 ? (
            <>
              <p className="text-[12px] text-[#797C80] mx-[6px]">·</p>
              {lang === 'en' ? (
                <p className="text-[12px] text-[#797C80]">
                  {reviewCount} {t('reply')}
                </p>
              ) : (
                <p className="text-[12px] text-[#797C80]">
                  {t('reply')} {reviewCount}
                </p>
              )}
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
