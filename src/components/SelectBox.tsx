import { Tables } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import React from 'react';

type Props = {
  user: User;
  post: Tables<'request_posts'> | Tables<'response_posts'>;
  setIsDModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: string;
};

const SelectBox = ({ user, post, setIsDModalOpen, mode }: Props) => {
  return (
    <>
      <div
        className={`bg-white grid w-[129px] rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] text-center p-2.5 justify-start items-center gap-1 absolute text-[#44484c] text-sm font-medium leading-tight ${
          mode === 'response'
            ? 'bottom-[45px] right-[0px]'
            : 'top-[45px] right-[23px]'
        }`}
      >
        {user?.id === post?.user_id ? (
          <>
            <button
              onClick={() => {
                if (user.id !== post?.user_id) {
                  alert('작성자가 아닙니다.');
                } else
                  location.href = `/${
                    mode === 'response' ? 'response-edit' : 'request-edit'
                  }/${post?.id}`;
              }}
              className="ml-2.5 mx-[4.5px] h-[29px]"
            >
              수정하기
            </button>
            <button
              onClick={() => {
                if (user.id !== post?.user_id) {
                  alert('작성자가 아닙니다.');
                } else setIsDModalOpen(true);
              }}
              className="ml-2.5 mx-[4.5px] h-[29px]"
            >
              삭제하기
            </button>
          </>
        ) : (
          <button
            onClick={() => alert('신고하기 기능은 아직 준비중입니다.')}
            className="ml-2.5 mx-[4.5px] h-[29px]"
          >
            신고하기
          </button>
        )}
      </div>
    </>
  );
};

export default SelectBox;
