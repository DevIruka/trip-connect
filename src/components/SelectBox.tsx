import { useModal } from '@/providers/ModalProvider';
import { Tables } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  user: User | null;
  requestPost?: Tables<'request_posts'>;
  responsePost?: Tables<'response_posts'>;
  mode?: string;
};

const SelectBox = ({ user, requestPost, responsePost, mode }: Props) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { t } = useTranslation('modal');

  return (
    <>
      <div
        className={`bg-white grid w-[129px] rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] text-center p-2.5 justify-start items-center gap-1 absolute text-[#44484c] text-sm font-medium leading-tight ${
          mode === 'response'
            ? 'bottom-[45px] right-[0px]'
            : 'top-[45px] right-[23px]'
        }`}
      >
        {user &&
        (user?.id === requestPost?.user_id ||
          user?.id === responsePost?.user_id) ? (
          <>
            <button
              onClick={() => {
                router.push(
                  `/${mode === 'response' ? 'response-edit' : 'request-edit'}/${
                    mode === 'response' ? responsePost?.id : requestPost?.id
                  }`,
                );
              }}
              className="ml-2.5 mx-[4.5px] h-[29px] text-left"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => {
                openModal('deleteConfirm', {
                  requestpost: requestPost,
                  responsepost: responsePost,
                });
              }}
              className="ml-2.5 mx-[4.5px] h-[29px] text-left"
            >
              {t('delete')}
            </button>
          </>
        ) : (
          <button
            onClick={() => alert(t('not_ready'))}
            className="ml-2.5 mx-[4.5px] h-[29px]"
          >
            {t('report')}
          </button>
        )}
      </div>
    </>
  );
};

export default SelectBox;
