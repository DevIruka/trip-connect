import { useTranslation } from 'react-i18next';
import HeaderButton from './HeaderButton';
import { useUserStore } from '@/store/userStore';
import { useModal } from '@/providers/ModalProvider';

export default function QnaHeader() {
  const { t } = useTranslation('home');
  const { user } = useUserStore();
  const { openModal } = useModal();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault(); // 링크 기본 동작 방지
      openModal('loginModal'); // 모달 열기
    }
  };

  return (
    <header className="h-[268px] pt-[28px] pb-[40px] bg-Gray9Fill md:h-[238px]">
      <div className="max-w-[1200px] px-[20px] mx-auto md:flex md:justify-between md:px-9 md:pt-10">
        <div className="md:min-w-[364px]">
          <div className="text-xl font-semibold pb-[8px] md:text-[28px] md:font-bold md:leading-[44.80px]">
            {t('chat_with_locals')}
          </div>
          <div className="text-Gray1 text-sm font-medium leading-snug pb-[32px] md:text-base md:leading-relaxed">
            {t('ask_questions')} <br />
            {t('share_answers')}
          </div>
        </div>
        <div className="flex gap-[7px] md:w-full md:justify-end">
          <HeaderButton
            url="request"
            title={t('ask_now')}
            text1={t('locals_answer')}
            text2={t('locals_answer_2')}
            handleClick={handleClick}
          />
          <HeaderButton
            url="response-list"
            title={t('answer_now')}
            text1={t('earn_credits')}
            text2={t('earn_credits_2')}
          />
        </div>
      </div>
    </header>
  );
}
