'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../../response/_components/TiptapEditor';
import HeaderWithButton from '../../response/_components/HeaderButtons';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EditResponsePage: React.FC = () => {
  const { responseId } = useParams();
  const router = useRouter();
  const [data, setData] = useState({
    title: '',
    contentHtml: '',
    freeContent: '',
  });
  const [request, setRequest] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchResponseDetails = async () => {
      try {
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

        const { data: requestData, error: requestError } = await supabase
          .from('request_posts')
          .select('title, content')
          .eq('id', responseData.request_id)
          .single();

        if (requestError) throw requestError;

        setRequest({ title: requestData.title, content: requestData.content });
      } catch (error) {
        console.error('Error:', error);
        alert('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponseDetails();
  }, [responseId]);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .update({
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
        })
        .eq('id', responseId);

      if (error) throw error;

      alert('수정이 완료되었습니다.');
      router.push(`/response/${responseId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('수정 중 문제가 발생했습니다.');
    }
  };

  if (isLoading) return <p>로딩 중...</p>;

  const title = request?.title || '';
  const maxVisibleChars = 20;
  const visibleTitle =
    title.length > maxVisibleChars
      ? title.slice(0, maxVisibleChars) + '...'
      : title;

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-y-auto">
      <HeaderWithButton
        buttonLabel="수정"
        onButtonClick={handleSubmit}
        disabled={!data.title || !data.contentHtml}
      />

      <div className="bg-[#F5F7FA] w-full mb-[16px] px-[20px] py-[16px]">
        <div className="flex flex-col gap-[8px]">
          {/* Q와 제목 */}
          <div className="flex justify-between items-center gap-[8px]">
            <div
              className="flex items-center gap-[8px] overflow-hidden"
              style={{
                maxWidth: 'calc(100% - 40px)',
              }}
            >
              <span
                style={{
                  color: '#0582FF',
                  flexShrink: 0,
                  fontWeight: 600,
                  fontSize: '16px',
                }}
              >
                Q
              </span>

              <span className="text-black text-[16px] font-semibold">
                {!isVisible ? visibleTitle : title}
              </span>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-[#797C80] flex-shrink-0"
              style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isVisible ? (
                <FaChevronUp width="9" height="5" />
              ) : (
                <FaChevronDown width="9" height="5" />
              )}
            </button>
          </div>
        </div>

        {/* 본문 내용 */}
        {isVisible && (
          <p className="mt-2 text-[#797C80] text-[14px] font-medium whitespace-pre-line">
            {request?.content}
          </p>
        )}
      </div>

      <TiptapEditor
        title={data.title}
        contentHtml={data.contentHtml}
        freeContent={data.freeContent}
        onChange={(updatedData) => setData(updatedData)}
      />
    </div>
  );
};

export default EditResponsePage;
