'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from './_components/TiptapEditor';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import HeaderWithButton from './_components/HeaderButtons';

const ResponsePage: React.FC = () => {
  const router = useRouter();
  // const { id } = useParams();
  const [data, setData] = useState({
    title: '',
    contentHtml: '',
    freeContent: '',
  });
  const [request, setRequest] = useState({ title: '', content: '' });
  const [isVisible, setIsVisible] = useState(false);

  const requestId = 'd5442544-fff0-4408-a496-4b3c7a52b194';

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('request_posts')
          .select('title, content')
          .eq('id', requestId)
          .single();

        if (error) throw error;

        setRequest({ title: data.title, content: data.content });
      } catch (error) {
        console.error('Error fetching request details:', error);
        alert('요청 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('response_posts').insert([
        {
          user_id: 'e5ed6f58-da46-4451-b5a2-80d058d2c1b0',
          request_id: 'd5442544-fff0-4408-a496-4b3c7a52b194',
          title: data.title,
          content_html: data.contentHtml,
          free_content: data.freeContent,
        },
      ]);

      if (error) throw error;

      alert('등록이 완료되었습니다.');
      router.push('/response');
    } catch (error) {
      console.error('Error:', error);
      alert('등록 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="p-0">
      <HeaderWithButton buttonLabel="등록" onButtonClick={handleSubmit} />

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

export default ResponsePage;
