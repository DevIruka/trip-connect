import React from 'react';

const calculateDday = (dateEnd: string): number => {
  const today = new Date(); // 오늘 날짜
  const endDate = new Date(dateEnd); // date_end를 날짜 객체로 변환

  // 날짜 차이를 계산 (밀리초 단위)
  const diffInMs = endDate.getTime() - today.getTime();

  // 일 단위로 변환
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // 하루: 1000ms * 60s * 60m * 24h
  return diffInDays;
};

const PostDday = ({ postDateEnd }: { postDateEnd: string }) => {
  const dDay = calculateDday(postDateEnd!);
  return (
    <>
      {dDay >= 0 ? (
        <p className="h-[22px] px-1.5 bg-[#ffecd4] rounded justify-center items-center inline-flex text-center text-[#ff800a] text-xs font-medium">
          D-{dDay}
        </p> // 미래 날짜인 경우
      ) : (
        <p className="h-[22px] px-1.5 bg-[#dee1e5] rounded justify-center items-center inline-flex text-center text-[#44484c] text-xs font-medium">
          기한 만료
        </p> // 이미 지난 날짜인 경우
      )}
    </>
  );
};

export default PostDday;
