import { useEffect, useState } from 'react';

type Props = {
  createdAt: string; // ISO 8601 날짜 문자열
};

const TimeAgo = ({ createdAt }: Props) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const createdDate = new Date(createdAt);
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

    setTimeAgo(calculateTimeAgo());
  }, [createdAt]);

  return <p className='text-[12px] text-[#797C80]'>{timeAgo}</p>;
};

export default TimeAgo;
