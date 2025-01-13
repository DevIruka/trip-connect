import HeaderButton from './headerButton';

export default function QnaHeader() {
  return (
    <header className="h-[180px] place-content-center px-5">
      <div className="flex gap-3">
        <HeaderButton
          url="request"
          text1="여행 예정 국가의"
          text2="현지인들이 답변해줘요"
          title="질문하기"
        />
        <HeaderButton
          url="response-list"
          text1="질문에 대해"
          text2="답변해보세요"
          title="답변하기"
        />
      </div>
    </header>
  );
}
