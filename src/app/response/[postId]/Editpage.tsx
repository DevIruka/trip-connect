'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../_components/TiptapEditor';
import HeaderWithButton from '../_components/HeaderButtons';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EditResponsePage: React.FC = () => {
  const { id } = useParams();
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
        .eq('id', id)
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
}, [id]);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .update({
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
        })
        .eq('id', id);

      if (error) throw error;

      alert('수정이 완료되었습니다.');
      router.push('/response');
    } catch (error) {
      console.error('Error:', error);
      alert('수정 중 문제가 발생했습니다.');
    }
  };

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <div className="p-0">
      <HeaderWithButton
        buttonLabel="수정"
        onButtonClick={handleSubmit}
        disabled={!data.title || !data.contentHtml}
      />

      {/* 상단 Q {title} 영역 */}
      <div className="bg-[#EFEFEF] w-full mb-4 border-b pb-2 px-5 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Q {request.title}</h1>
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
            {request.content}
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
