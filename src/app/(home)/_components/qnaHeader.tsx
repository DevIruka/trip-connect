import Link from 'next/link';

export default function QnaHeader() {
  return (
    <header className="grid">
      <div className="flex gap-4">
        <Link
          href={`/request`}
          className="w-[50%] h-[100px] bg-black text-white rounded-s"
        >
          <div>여행 예정 국가의 현지인들이 답변해줘요</div>
          <div>질문하기</div>
        </Link>
        <Link
          href={`/response-list`}
          className="w-[50%] h-[100px] bg-black text-white rounded-s"
        >
          <div>질문에 대해 답변해보세요</div>
          <div>답변하기</div>
        </Link>
      </div>
    </header>
  );
}
