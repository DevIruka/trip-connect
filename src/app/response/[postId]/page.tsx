'use client';

import React, { useState } from 'react';
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

const fetchRequestDetails = async (
  postId: string,
): Promise<RequestDetails> => {
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

  const { data: request, isLoading, error } = useQuery<RequestDetails, Error>({
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

  return (
    <div className="p-0">
      <HeaderWithButton buttonLabel="등록" onButtonClick={handleSubmit} />

      {/* 상단 Q {title} 영역 */}
      <div className="bg-[#EFEFEF] w-full mb-4 border-b pb-2 px-5 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Q {request?.title}</h1>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isVisible ? (
              <FaChevronUp size={20} />
            ) : (
              <FaChevronDown size={20} />
            )}
          </button>
        </div>
        {isVisible && (
          <p className="mt-2 text-gray-700 whitespace-pre-line">
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
