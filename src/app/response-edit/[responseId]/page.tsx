'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../../response/_components/TiptapEditor';
import HeaderWithButton from '../../response/_components/HeaderButtons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const EditResponsePage: React.FC = () => {
  const { t } = useTranslation('response');
  const { responseId } = useParams();
  const router = useRouter();
  const [data, setData] = useState({
    title: '',
    contentHtml: '',
    freeContent: '',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['response', responseId],
    queryFn: async () => {
      const { data: responseData, error: responseError } = await supabase
        .from('response_posts')
        .select('title, content_html, free_content, request_id')
        .eq('id', responseId)
        .single();

      if (responseError) throw responseError;

      setData({
        title: responseData.title,
        contentHtml: responseData.content_html,
        freeContent: responseData.free_content,
      });

      setRequestId(responseData.request_id);

      const { data: requestData, error: requestError } = await supabase
        .from('request_posts')
        .select('title, content')
        .eq('id', responseData.request_id)
        .single();

      if (requestError) throw requestError;

      return { responseData, requestData };
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('response_posts')
        .update({
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
        })
        .eq('id', responseId);

      if (error) throw error;
    },
    onSuccess: () => {
      alert('수정이 완료되었습니다.');
      router.push(`/post/${requestId}`);
    },
    onError: (error) => {
      console.error('Error:', error);
      alert('수정 중 문제가 발생했습니다.');
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate();
  };

  if (isLoading) return <p>로딩 중...</p>;

  const title = responseData?.requestData?.title || '';
  const maxVisibleChars = 20;
  const visibleTitle =
    title.length > maxVisibleChars
      ? title.slice(0, maxVisibleChars) + '...'
      : title;

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-y-auto">
      <div className="md:hidden">
        <HeaderWithButton
          buttonKey="edit"
          onButtonClick={handleSubmit}
          disabled={!data.title || !data.contentHtml}
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
              {responseData?.requestData?.content}
            </p>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center w-full">
        <div className="w-full max-w-[800px] border border-[#DFE1E5] rounded-[8px] border-[1px] overflow: hidden;">
          <HeaderWithButton
            buttonKey={t('edit')}
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

export default EditResponsePage;
