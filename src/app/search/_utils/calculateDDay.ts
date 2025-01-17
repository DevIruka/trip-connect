export const calculateDDay = (targetDateString: string | undefined): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(targetDateString!);
  targetDate.setHours(0, 0, 0, 0);

  if (isNaN(targetDate.getTime())) {
    throw new Error(
      '유효한 날짜 형식이 아닙니다. YYYY-MM-DD 형식으로 입력하세요.',
    );
  }

  // 🛠️ 수정: getTime()을 사용해 number 타입으로 변환
  const diffInMilliseconds = targetDate.getTime() - today.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays > 0
    ? `D-${diffInDays}`
    : diffInDays === 0
    ? 'D-DAY'
    : `D+${Math.abs(diffInDays)}`;
};
