'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { ResponsePost } from '../_type/type';
import Image from 'next/image';
import TimeAgo from './TimeAgo';
import { useRouter } from 'next/navigation';
import { convertToKorean } from '../_util/convertTopicMapping';
import { EnglishCategory } from '@/utils/topics';
import { useTranslation } from 'react-i18next';
import { useLang } from '@/store/languageStore';
import { countryNameMapping } from '@/data/nation';
import { capitalizeFirstLetter } from '@/app/search/_utils/capitalize';
import RenderonlyTextHTML from '@/hook/home/RenderonlyTextHTML';
import ModalForm from '@/components/ModalForm';
import caution from '@/data/images/⚠️ 주의.svg';
const coinIcon = '/images/coin.svg';
const markerIcon = '/images/ic-location.svg';


const ResponsePostCard: React.FC<{
  post: ResponsePost;
  editable?: boolean;
  isLangEffects?: boolean;
}> = ({ post, editable = true, isLangEffects }) => {
  const { lang } = useLang();
  const { t } = useTranslation('mypage');
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [category, setCategory] = useState<EnglishCategory[]>([]);
  const [credit, setCredit] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  
  const fetchCommentCount = useCallback(async () => {
    if (!post.request_id) return;

try {
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('response_id', post.id);

  if (!error) {
    setCommentCount(count || 0);
  }
    } catch { }
    
  }, [post.request_id]);

const fetchUserNickname = useCallback(async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) {
      setNickname(t('unknown'));
    } else {
      setNickname(data?.nickname || t('unknown'));
    }
  } catch {
    setNickname(t('unknown'));
  }
}, [t]);


  const fetchRequestDetails = useCallback(async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('request_posts')
        .select('country_city, category, credit')
        .eq('id', requestId)
        .single();

      if (error) {
        setCountry(t('unknown'));
        setCategory([]);
      } else {
        const countryCity = JSON.parse(data?.country_city || '{}');
        setCountry(countryCity.country || t('unknown'));
        setCategory(data?.category || []);
        setCredit(data?.credit || null);
      }
    } catch {
      setCountry(t('unknown'));
      setCategory([]);
    }
  }, [t]);

  useEffect(() => {
    if (post.user_id) {
      fetchUserNickname(post.user_id);
    }
    if (post.request_id) {
      fetchRequestDetails(post.request_id);
    }
    fetchCommentCount();
  }, [
    post.user_id,
    post.request_id,
    fetchCommentCount,
    fetchUserNickname,
    fetchRequestDetails,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(`#action-menu-${post.id}`) &&
        !target.closest(`#more-button-${post.id}`)
      ) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showActions, post.id]);

  const handleDelete = () => {
    if (commentCount > 0) {
      alert(t('cannot_delete_with_comments'));
    } else {
      setIsModalOpen(true); // 모달 열기
    }
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .delete()
        .eq('id', post.id);

      if (error) {
        alert(t('delete_error'));
        return;
      }

      setAlertMessage(t('delete_success'));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      router.refresh();
    } catch {
      alert(t('unexpected_error'));
    }
  };


  const handleCardClick = () => {
    if (post.request_id) {
      router.push(`/post/${post.request_id}`);
    } else {
      console.error('Request ID가 존재하지 않습니다.');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col items-start gap-3 md:gap-[17px] border-b border-gray-200 bg-white w-full p-6 md:w-[800px] md:h-[252px] md:px-[36px] md:py-[28px] md:mb-[10px] md:rounded-[12px] md:border md:border-[#DFE1E5] md:bg-white md:mx-auto last:mb-[100px]"
    >
      {/* 상단 - 위치와 카테고리 */}
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-2">
          {/* 위치 */}
          <div className="flex items-center text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1">
            <Image src={markerIcon} alt="location" width={12} height={12} />
            {country && (
              <span className="ml-1">
                {lang === 'en'
                  ? countryNameMapping[country] || 'Unknown'
                  : country}
              </span>
            )}
          </div>
          {/* 카테고리 */}
          {(category || []).slice(0, 2).map((cat, i) => (
            <div
              key={i}
              className="text-gray-700 text-sm bg-gray-100 rounded-md px-2 py-1"
            >
              {lang === 'en'
                ? capitalizeFirstLetter(cat)
                : convertToKorean(cat)}
            </div>
          ))}
        </div>

        {/* More 버튼 */}
        {editable && (
          <div className="relative">
            <button
              id={`more-button-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions((prev) => !prev);
              }}
              className="p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={14}
                height={14}
                fill="none"
              >
                <circle cx="12" cy="5" r="2" fill="#797C80" />
                <circle cx="12" cy="12" r="2" fill="#797C80" />
                <circle cx="12" cy="19" r="2" fill="#797C80" />
              </svg>
            </button>
            {showActions && (
              <div
                id={`action-menu-${post.id}`}
                className="absolute top-full right-0 flex flex-col items-start gap-[10px] p-[8px] w-[129px] rounded-[8px] border border-[#F4F4F4] bg-white shadow-md"
              >
                {/* 수정하기 버튼 */}
                <button
                  className="flex w-full items-center gap-[10px] p-[6px_10px] rounded-[8px] text-[14px] font-medium text-[#45484D] Pretendard text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/response-edit/${post.id}`);
                  }}
                >
                  수정하기
                </button>
                {/* 삭제하기 버튼 */}
                <button
                  className="flex w-full items-center gap-[10px] p-[6px_10px] rounded-[8px] text-[14px] font-medium text-[#45484D] Pretendard text-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 제목 및 내용 */}
      <div className="flex items-start gap-2">
        <p className="text-red-500 text-base font-semibold leading-6">A.</p>
        <div className="flex flex-col">
          <div className="mb-2">
            <p className="text-base md:text-[18px] font-bold text-black leading-6 md:h-[50px] line-clamp-2">
              {isLangEffects ? (
                lang === 'ko' ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: post.translated_title || t('no_title'),
                    }}
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: post.title || t('no_title'),
                    }}
                  />
                )
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: post.translated_title || t('no_title'),
                  }}
                />
              )}
            </p>
          </div>
          <div>
            <div className="max-h-[38.5px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2 md:h-[38px]">
              {isLangEffects ? (
                lang === 'ko' ? (
                  <RenderonlyTextHTML
                    data={{
                      original: '',
                      translated: post.translated_free_content,
                    }}
                  />
                ) : (
                  <RenderonlyTextHTML
                    data={{
                      original: '',
                      translated: post.free_content,
                    }}
                  />
                )
              ) : (
                <RenderonlyTextHTML
                  data={{
                    original: '',
                    translated: post.free_content,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 - 크레딧, 댓글 수, 작성 시간 */}
      <div className="flex justify-between items-center md:text-[14px] text-sm text-gray-500 w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image src={coinIcon} alt="coin" width={14} height={14} />
            <span>{credit}</span>
          </div>
          <>
            <span>·</span>
            <span>
              {t('writer')} {nickname}
            </span>
            <span>·</span>
            <span>
              {t('reply')} {commentCount}
            </span>
          </>
        </div>

        <div className="ml-5 md:ml-0 md:text-[14px]">
          <TimeAgo createdAt={post.created_at || new Date().toISOString()} />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <ModalForm
            onClose={() => setIsModalOpen(false)}
            imageSrc={caution}
            text={t('delete_confirm_title')}
            text1={t('delete_confirm_warning')}
            text2=""
            buttonTxt1={t('cancel')}
            buttonTxt2={t('delete')}
            onYesClick={confirmDelete}
            color="bg-red-500"
          />
        </div>
      )}

      {/* 삭제 알림창 */}
      {showAlert && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex w-[335px] p-3 justify-center items-center rounded-md bg-black bg-opacity-70 z-50">
          <span className="text-white text-sm font-semibold">
            {alertMessage}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResponsePostCard;
