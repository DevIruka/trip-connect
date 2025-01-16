type SearchResultCountProps = {
  filter: 'all' | 'question' | 'answer';
  countReq: number | null;
  countRes: number | null;
};

const SearchResultCount = ({
  filter,
  countReq,
  countRes,
}: SearchResultCountProps) => {
  return (
    <>
      <div className="flex flex-row items-center h-[29px]">
        <p className="font-bold text-[18px]">검색 결과 </p>
        <span className="font-semibold ml-2 text-[16px] text-gray-500">
          {filter === 'all'
            ? countReq! + countRes!
            : filter === 'question'
            ? countReq!
            : countRes!}
        </span>
      </div>
    </>
  );
};
export default SearchResultCount;
