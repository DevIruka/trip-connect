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
      <div className="flex flex-row items-center">
        <p className="font-bold text-xl my-2">검색 결과 </p>
        <span className="ml-2 text-xl text-gray-500">
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
