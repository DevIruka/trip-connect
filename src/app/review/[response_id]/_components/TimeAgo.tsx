import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

type Props = {
  createdAt: string | null; // ISO 8601 날짜 문자열
};
const calculateTimeAgo = (createdAt: string | null): { type: string; count?: number } => {
  if (!createdAt) return { type: 'justNow' };

  const createdDate = new Date(createdAt!);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime(); // 밀리초 차이 계산
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 일 단위로 변환
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // 시간 단위
  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // 분 단위

  if (diffMinutes < 1) {
    return { type: 'justNow' }; // 방금 전
  } else if (diffHours < 1) {
    return { type: 'minutesAgo', count: diffMinutes }; // {{count}}분 전
  } else if (diffDays < 1) {
    return { type: 'hoursAgo', count: diffHours }; // {{count}}시간 전
  } else {
    return { type: 'daysAgo', count: diffDays }; // {{count}}일 전
  }
};

const TimeAgo = ({ createdAt }: Props) => {
  const { t } = useTranslation('timeAgo');

  const { data: timeAgoData  } = useQuery({
    queryKey: ['timeAgo', createdAt],
    queryFn: () => calculateTimeAgo(createdAt),
    refetchInterval: 60000, // 1분마다 갱신
    enabled: !!createdAt, // createdAt이 null이 아니어야 실행
    initialData: () => calculateTimeAgo(createdAt), // 초기 데이터 설정
  });

  if (!createdAt || !timeAgoData ) return null;

  const timeAgoText =
    timeAgoData.count !== undefined
      ? t(timeAgoData.type, { count: timeAgoData.count })
      : t(timeAgoData.type);

  return (
    <p className="text-xs text-[#797C80]">
      {timeAgoText} {t('purchase')}
    </p>
  );
};

export default TimeAgo;
