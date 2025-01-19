import { UseFormHandleSubmit } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';

type RecentSearchListProps = {
  recentSearches: string[];
  handleSubmit: UseFormHandleSubmit<
    {
      searchQuery: string;
      recentSearches: string[];
    },
    undefined
  >;
  handleSearch: () => void;
  handleRecentSearchClick: (term: string) => Promise<void>
  handleRecentSearchDelete: (term: string) => void;
};

const RecentSearchList = ({
  recentSearches,
  handleSubmit,
  handleSearch,
  handleRecentSearchClick,
  handleRecentSearchDelete,
}: RecentSearchListProps) => {
  console.log(recentSearches)
  return (
    <>
      <ul className="flex flex-row gap-[4px] items-center overflow-x-auto whitespace-nowrap">
        {recentSearches && recentSearches.length > 0 ? (
          recentSearches.map((term, index) => (
            <li
              key={index}
              className="flex flex-row justify-between items-center rounded-full border border-[#DFE1E5] mt-[20px]"
            >
              <form
                onSubmit={handleSubmit(handleSearch)}
                className="flex flex-row items-center px-[16px] py-[9.5px]"
              >
                <button
                  type="submit"
                  className="text-[14px] text-[#45484D] pr-[4px]"
                  onClick={() => handleRecentSearchClick(term)}
                >
                  {term}
                </button>
                <button
                  type="button"
                  onClick={() => handleRecentSearchDelete(term)}
                >
                  <RxCross2
                    size={16}
                    className="cursor-pointer"
                    style={{ color: '#797C80' }}
                  />
                </button>
              </form>
            </li>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center w-full">
            <p className="text-xl font-bold pt-10 text-center">
              검색어를 입력해주세요.
            </p>
          </div>
        )}
      </ul>
    </>
  );
};
export default RecentSearchList;
