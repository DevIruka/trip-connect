import Image from 'next/image';
import React from 'react';
import caution from '@/data/images/⚠️ 주의.svg';
import { fetchPostDelete } from '@/utils/api/supabase_api/home/fetchPostDelete';
import { useUserStore } from '@/store/userStore';
import { Tables } from '@/types/supabase';
import { fetchResPostDelete } from '@/utils/api/supabase_api/home/fetchResPostDelete';
type Props = {
  isOpen: boolean;
  onClose: () => void;
  requestpost?: Tables<'request_posts'>;
  responsepost?: Tables<'response_posts'>;
};
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  requestpost,
  responsepost,
}: Props) => {
  const { user } = useUserStore();

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음
  return (
    <div
      className="fixed top-0 z-[100] bg-[#111111]/60 w-[374px] h-full grid items-center"
      onClick={onClose}
    >
      {/* 흰색 배경 모달 */}
      <div
        className="bg-white h-[212px] rounded-2xl px-6 py-4 place-items-center grid gap-3 mx-5"
        onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
      >
        {/* 모달 내용 */}
        <Image src={caution} alt="cautions" width={40} height={40} />
        <div className="text-center text-[#44484c] text-base font-semibold leading-snug">
          정말 삭제하시겠어요? <br />
          삭제 후에는 글을 복구할 수 없어요
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4 mt-4 w-full">
          <div
            className="flex-1 py-3 text-sm font-semibold text-Gray1 bg-Gray9Fill rounded-lg w-[100px] text-center"
            onClick={onClose}
          >
            취소
          </div>
          <div
            className="flex-1 py-3 text-sm font-semibold text-white bg-Red1 rounded-lg w-[100px] text-center"
            onClick={() => {
              if (requestpost) fetchPostDelete(requestpost, user?.id);
              else if (responsepost) fetchResPostDelete(responsepost, user?.id);
            }}
          >
            삭제
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
