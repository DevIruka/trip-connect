'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../_components/TiptapEditor';
import HeaderWithButton from '../_components/HeaderButtons';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from 'react-i18next';
import { Editor } from '@tiptap/core';
import { getGPTTranslator } from '@/app/post/_hooks/getGPTTranslator';

type RequestDetails = {
  title: string;
  content: string;
  country_city: string;
  users: { country: string };
};

const fetchRequestDetails = async (postId: string): Promise<RequestDetails> => {
  const { data, error } = await supabase
    .from('request_posts')
    .select('title, content, country_city, users!inner(country)')
    .eq('id', postId)
    .single();

  if (error) throw error;

  // TODO: 타입 강제 변경
  return data as unknown as RequestDetails;
};

const ResponsePage = ({ params }: { params: { postId: string } }) => {
  const router = useRouter();
  const { postId } = params;
  const { user } = useUserStore();
  const { t } = useTranslation('response');
  const [data, setData] = useState({
    title: '',
    contentHtml: '',
    freeContent: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  const {
    data: request,
    isLoading,
    error,
  } = useQuery<RequestDetails, Error>({
    queryKey: ['requestDetails', postId],
    queryFn: () => fetchRequestDetails(postId),
    enabled: !!postId,
  });

  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      const response = await getGPTTranslator(
        `${data.title}`,
        request?.users.country,
      );
      const freeResponse = await getGPTTranslator(
        `${data.freeContent}`,
        request?.users['country'],
      );
      const contentResponse = await getGPTTranslator(
        `${data.contentHtml}`,
        request?.users['country'],
      );

      const { error } = await supabase.from('response_posts').insert([
        {
          user_id: user.id,
          request_id: postId,
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
          translated_title: JSON.parse(
            response?.choices[0]?.message?.content ?? '{}',
          ).translated,
          translated_free_content: JSON.parse(
            freeResponse?.choices[0]?.message?.content ?? '{}',
          ).translated,
          translated_content: JSON.parse(
            contentResponse?.choices[0]?.message?.content ?? '{}',
          ).translated,
        },
      ]);

      if (error) throw error;

      alert('등록이 완료되었습니다.');
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('등록 중 문제가 발생했습니다.');
    }
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>요청 정보를 불러오는 중 오류가 발생했습니다.</p>;

  const title = request?.title || '';
  const maxVisibleChars = 20;
  const visibleTitle =
    title.length > maxVisibleChars
      ? title.slice(0, maxVisibleChars) + '...'
      : title;

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-y-auto">
      <div className="md:hidden">
        <HeaderWithButton
          buttonKey={t('register')}
          onButtonClick={handleSubmit}
        />
      </div>

      <div className="bg-[#F5F7FA] w-full mb-[16px] px-[20px] py-[16px] md:py-[28px] md:mb-[40px]">
        <div className="mx-auto max-w-[800px] box-border">
          <div className="flex flex-col gap-[8px]">
            {/* Q와 제목 */}
            <div className="flex justify-between items-center gap-[8px]">
              <div
                className="flex items-center gap-[8px] overflow-hidden"
                style={{
                  maxWidth: 'calc(100% - 40px)',
                }}
              >
                <span className="text-[16px] font-[600] text-[#0582FF] flex-shrink-0 md:text-lg md:font-semibold">
                  Q
                </span>

                <span className="text-black text-[16px] font-semibold">
                  {!isVisible ? visibleTitle : title}
                </span>
              </div>
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="text-[#797C80] flex-shrink-0"
              >
                {isVisible ? (
                  <svg
                    className="w-[18px] h-[18px] md:w-[24px] md:h-[24px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 15L12 9L18 15"
                      stroke="#797C80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-[18px] h-[18px] md:w-[24px] md:h-[24px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="#797C80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 본문 내용 */}
          {isVisible && (
            <p className="mt-2 text-[#797C80] text-[14px] font-medium whitespace-pre-line md:mt-5">
              {request?.content}
            </p>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center w-full md:pb-[80px]">
        <div className="w-full max-w-[800px] border border-[#DFE1E5] rounded-[8px] border-[1px] overflow: hidden;">
          <HeaderWithButton
            buttonKey={t('register')}
            onButtonClick={handleSubmit}
          />

          <TiptapEditor
            title={data.title}
            contentHtml={data.contentHtml}
            freeContent={data.freeContent}
            onChange={(updatedData) => setData(updatedData)}
          />
        </div>
      </div>

      <div className="md:hidden">
        <TiptapEditor
          title={data.title}
          contentHtml={data.contentHtml}
          freeContent={data.freeContent}
          onChange={(updatedData) => setData(updatedData)}
        />
      </div>
    </div>
  );
};

export default ResponsePage;
