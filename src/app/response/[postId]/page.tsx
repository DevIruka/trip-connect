'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../_components/TiptapEditor';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import HeaderWithButton from '../_components/HeaderButtons';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';

type RequestDetails = {
  title: string;
  content: string;
};

const fetchRequestDetails = async (postId: string): Promise<RequestDetails> => {
  const { data, error } = await supabase
    .from('request_posts')
    .select('title, content')
    .eq('id', postId)
    .single();

  if (error) throw error;

  return data;
};

const ResponsePage = ({ params }: { params: { postId: string } }) => {
  const router = useRouter();
  const { postId } = params;
  const { user } = useUserStore();

  const [data, setData] = useState({
    title: '',
    contentHtml: '',
    freeContent: '',
  });
  const [isVisible, setIsVisible] = useState(false);

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
      const { error } = await supabase.from('response_posts').insert([
        {
          user_id: user.id,
          request_id: postId,
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
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
      <HeaderWithButton buttonLabel="등록" onButtonClick={handleSubmit} />

      <div className="bg-[#F5F7FA] w-full mb-4 px-[20px] py-[16px]">
        <div className="flex flex-col gap-[8px]">
          {/* Q와 제목 */}
          <div className="flex justify-between items-center gap-[8px]">
            <div
              className="flex items-center gap-[8px] overflow-hidden"
              style={{
                maxWidth: 'calc(100% - 40px)',
              }}
            >
              <span style={{ color: '#0582FF', flexShrink: 0 }}>Q</span>
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

export default ResponsePage;
