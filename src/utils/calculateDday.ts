export const calculateDday = (dateEnd: string): number => {
  const today = new Date(); // 오늘 날짜
  const endDate = new Date(dateEnd); // date_end를 날짜 객체로 변환

  // 날짜 차이를 계산 (밀리초 단위)
  const diffInMs = endDate.getTime() - today.getTime();

  // 일 단위로 변환
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // 하루: 1000ms * 60s * 60m * 24h
  return diffInDays;
};
