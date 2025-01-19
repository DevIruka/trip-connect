import HeaderButton from './headerButton';

export default function QnaHeader() {
  return (
    <header className="h-[268px] px-[20px] pt-[28px] pb-[40px] bg-[#f4f6f9]">
      <div className="text-xl font-semibold pb-[8px]">
        현지인과 직접 소통해요!
      </div>
      <div className="text-[#44484c] text-sm font-medium leading-snug pb-[32px]">
        질문으로 소중한 정보를 얻고 <br />
        답변으로 내가 아는 것을 공유해요
      </div>
      <div className="flex gap-[7px]">
        <HeaderButton
          url="request"
          title="질문하기"
          text1="여행 예정 국가의"
          text2="현지인들이 답변해줘요"
        />
        <HeaderButton
          url="response-list"
          title="답변하기"
          text1="질문에 답변하고"
          text2="크레딧을 얻어보세요"
        />
      </div>
    </header>
  );
}
