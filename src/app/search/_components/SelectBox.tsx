import { Dispatch, SetStateAction } from 'react';

type SelectBoxProps = {
  filter: 'all' | 'question' | 'answer';
  setFilter: Dispatch<SetStateAction<'all' | 'question' | 'answer'>>;
};

const SelectBox = ({ filter, setFilter }: SelectBoxProps) => {
  return (
    <>
      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value as 'all' | 'question' | 'answer')
        }
        className={`p-2 border rounded`}
      >
        <option value="all">질문&답변</option>
        <option value="question">질문글</option>
        <option value="answer">답변글</option>
      </select>
    </>
  );
};
export default SelectBox;
