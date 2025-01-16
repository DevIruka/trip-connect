import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';

type SelectBoxProps = {
  filter: 'all' | 'question' | 'answer';
  setFilter: (value: 'all' | 'question' | 'answer') => void;
};

const CustomSelectBox = ({ filter, setFilter }: SelectBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: 'all' | 'question' | 'answer') => {
    setFilter(value);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center items-center relative">
      <div
        className="flex items-center text-right h-[29px] w-[72px] rounded py-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="w-[56px] text-[14px] tracking-[-0.28px]">
          {filter === 'all'
            ? '질문&답변'
            : filter === 'question'
            ? '질문'
            : '답변'}
        </p>
        <FaAngleDown color="gray" />
      </div>

      {isOpen && (
        <ul className="flex flex-col items-center justify-center absolute top-7 right-0 bg-white border rounded-[8px] mt-2 w-[129px] shadow-lg z-10">
          <li
            className={`flex items-center h-[29px] justify-center my-[4px] w-[113px] px-4 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'all'
                ? 'bg-[#EBF5FF] text-[#0582FF]'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('all')}
          >
            질문&답변
          </li>
          <li
            className={`flex items-center justify-center h-[29px] my-[4px] w-[113px] px-4 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'question'
                ? 'bg-[#EBF5FF] text-[#0582FF]'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('question')}
          >
            질문글
          </li>
          <li
            className={`flex items-center justify-center h-[29px] my-[4px] w-[113px] px-4 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'answer'
                ? 'bg-[#EBF5FF] text-[#0582FF]'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('answer')}
          >
            답변글
          </li>
        </ul>
      )}
    </div>
  );
};

export default CustomSelectBox;
