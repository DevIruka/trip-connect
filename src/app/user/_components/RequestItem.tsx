import { convertTopicsToKorean } from '@/utils/topics';
// import TimeAgo from './TimeAgo';
import { useRouter } from 'next/navigation';
import { ReqResPost } from '@/app/search/[id]/_components/SearchResults';
import { countryNameMapping } from '@/data/nation';
import { useLang } from '@/store/languageStore';
import { useTranslation } from 'react-i18next';
import TimeAgo from '@/app/search/[id]/_components/TimeAgo';
import Dday from '@/app/search/[id]/_components/DDay';

export const categoryIconMapping: Record<string, string> = {
  맛집: '🥘',
  쇼핑: '🛍️',
  숙소: '🛏️',
  이벤트: '🎉',
  '일정/경비': '💰️',
  문화: '🌏️',
  역사: '📚️',
  액티비티: '🎿',
  기타: '⁉️',
};

const calculateDday = (dateEnd: string): string => {
  const today = new Date();
  const endDate = new Date(dateEnd);
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `D-${diffDays}` : 'D-00';
};

const RequestItem = ({
  post,
  responseCount,
}: {
  post: ReqResPost;
  responseCount: number;
}) => {
  const { lang } = useLang();
  const { t } = useTranslation('user');
  const router = useRouter();
  const { date_end, country_city, category, title, content, created_at } = post;
  const dDay = calculateDday(date_end!);
  const country = JSON.parse(String(country_city!))?.country || '';
  const categoryKorean = convertTopicsToKorean(category!);
  const categoryIcon = categoryKorean.map(
    (cat) => categoryIconMapping[cat] || '❓',
  );

  const handleNavigate = () => {
    router.push(`/post/${post.id}`); // 라우팅 설정
  };

  return (
    <div
      className="relative"
      style={{
        padding: '12px 20px 24px',
      }}
      onClick={handleNavigate}
    >
      <div
        className="absolute inset-0 border-b"
        style={{
          borderColor: '#F4F4F4',
          left: '20px',
          right: '20px',
        }}
      ></div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Dday postDateEnd={date_end!}/>
        <div className="flex gap-2 text-xs text-gray-500">
          <div
            className="flex items-center gap-1 bg-[#F5F7FA] rounded-[4px] px-1.5 py-0.5"
            style={{
              paddingLeft: '4px',
              paddingRight: '6px',
            }}
          >
            <img
              src="/images/ic-location.svg"
              alt="location"
              className="w-[10px] h-[10px]"
            />
            <span className="text-[12px] font-medium text-[#45484D]">
              {lang === 'en' ? countryNameMapping[country] : country}
            </span>
          </div>

          <div
            className="flex gap-1 bg-[#F5F7FA] rounded-[4px] items-center justify-center"
            style={{
              padding: '0 6px',
              minHeight: '24px',
            }}
          >
            <span>{categoryIcon[0]}</span>
            <span className="text-[12px] font-medium text-[#45484D]">
              {lang === 'en' ? category![0] : categoryKorean[0]}
            </span>
          </div>
        </div>
      </div>

      <h3 className="flex items-start gap-[6px] mb-[8px]">
        <span className="text-[#0582ff] text-[16px] font-semibold leading-[1.25]">
          Q.
        </span>
        <span
          className="text-[#000] text-[16px] font-semibold leading-tight line-clamp-2"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 2, // 두 줄까지만 표시
          }}
        >
          {title}
        </span>
      </h3>
      <p
        className="text-[14px] font-medium text-[#797C80] mb-[12px]"
        style={{
          marginLeft: 'calc(16px + 6px)',
          lineHeight: '1.25',
        }}
      >
        {content}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-[6px]">
          <div className="flex items-center gap-[4px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="9"
                cy="9"
                r="7.94118"
                fill="#EBEBEB"
                stroke="#C6C9CC"
                strokeWidth="2.11765"
              />
              <path
                d="M10.7237 7.85106C10.6523 7.04247 10.1054 6.50737 9.18974 6.50737C8.00063 6.50737 7.32284 7.42298 7.32284 8.95693C7.32284 10.5741 8.01252 11.4065 9.17785 11.4065C10.0459 11.4065 10.6048 10.9309 10.7237 10.1698L13.0187 10.1936C12.8998 11.6681 11.6036 13.3804 9.13029 13.3804C6.76396 13.3804 4.99219 11.8108 4.99219 8.95693C4.99219 6.09118 6.81152 4.53345 9.13029 4.53345C11.2707 4.53345 12.8284 5.73445 13.0187 7.85106H10.7237Z"
                fill="#A9A9A9"
              />
            </svg>
            <span className="text-[12px] font-medium text-[#797C80]">
              {post.credit?.toLocaleString()}
            </span>
          </div>
          <span
            className="mx-[6px]"
            style={{
              display: 'inline-block',
              width: '2px',
              height: '2px',
              backgroundColor: '#797C80',
              borderRadius: '50%',
              margin: '0',
              padding: '0',
            }}
          ></span>
          <span className="text-[12px] font-semibold text-[#797C80]">
            {responseCount}{t('totalAnswers')}
          </span>
        </div>

        <div className="text-[12px] font-medium text-[#808080]">
          <TimeAgo createdAt={created_at} />
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
