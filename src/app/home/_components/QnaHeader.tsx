import { useTranslation } from 'react-i18next';
import HeaderButton from './HeaderButton';

export default function QnaHeader({
  setIsModalOpen,
}: {
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation('home');

  return (
    <header className="h-[268px] px-[20px] pt-[28px] pb-[40px] bg-[#f4f6f9]">
      <div className="text-xl font-semibold pb-[8px]">
        {t('chat_with_locals')}
      </div>
      <div className="text-[#44484c] text-sm font-medium leading-snug pb-[32px]">
        {t('ask_questions')} <br />
        {t('share_answers')}
      </div>
      <div className="flex gap-[7px]">
        <HeaderButton
          setIsModalOpen={setIsModalOpen}
          url="request"
          title={t('ask_now')}
          text1={t('locals_answer')}
          text2={t('locals_answer_2')}
        />
        <HeaderButton
          url="response-list"
          title={t('answer_now')}
          text1={t('earn_credits')}
          text2={t('earn_credits_2')}
        />
      </div>
    </header>
  );
}
