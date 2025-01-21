import { useQuery } from '@tanstack/react-query';

type Props = {
  createdAt: string | null; // ISO 8601 날짜 문자열
};
const calculateTimeAgo = (createdAt: string | null): string => {
  if (!createdAt) return '';
  
  const createdDate = new Date(createdAt!);
  const now = new Date();

  const diffMs = now.getTime() - createdDate.getTime(); // 밀리초 차이 계산
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 일 단위로 변환
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // 시간 단위
  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // 분 단위

  if (diffMinutes < 1) {
    return '방금 전';
  } else if (diffHours < 1) {
    return `${diffMinutes}분 전`;
  } else if (diffDays < 1) {
    return `${diffHours}시간 전`;
  } else {
    return `${diffDays}일 전`;
  }
};

const TimeAgo = ({ createdAt }: Props) => {
  const { data: timeAgo } = useQuery({
    queryKey: ['timeAgo', createdAt],
    queryFn: () => calculateTimeAgo(createdAt),
    refetchInterval: 60000, // 1분마다 갱신
    enabled: !!createdAt, // createdAt이 null이 아니어야 실행
    initialData: () => calculateTimeAgo(createdAt), // 초기 데이터 설정
  });

  if (!createdAt || !timeAgo) return null;

  return <p className="text-xs text-[#797C80]">{timeAgo} 구매</p>;
};

export default TimeAgo;
