import { Tables } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import React from 'react';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  post: Tables<'request_posts'> | Tables<'response_posts'>;
  setIsDModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectBox = ({
  isModalOpen,
  setIsModalOpen,
  user,
  post,
  setIsDModalOpen,
}: Props) => {
  return (
    <>
      <div
        className="w-full h-screen absolute top-0 right-0"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <div className="bg-white grid w-[129px] rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] text-center p-2.5 justify-start items-center gap-1 absolute top-[45px] right-[23px] text-[#44484c] text-sm font-medium leading-tight">
          {user ? (
            <>
              <button
                onClick={() => {
                  if (user.id !== post?.user_id) {
                    alert('작성자가 아닙니다.');
                  } else location.href = `/request-edit/${post?.id}`;
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
      </div>
    </>
  );
};

export default SelectBox;
