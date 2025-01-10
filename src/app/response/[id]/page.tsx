'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from '../_components/TiptapEditor';

const EditResponsePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState({ title: '', contentHtml: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchResponseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('response_posts')
        .select('title, content_html')
        .eq('id', id)
        .single();

      if (error) throw error;

      setData({ title: data.title, contentHtml: data.content_html });
    } catch (error) {
      console.error('Error:', error);
      alert('데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .update({ title: data.title, content_html: data.contentHtml })
        .eq('id', id);

      if (error) throw error;

      alert('수정이 완료되었습니다.');
      router.push('/response');
    } catch (error) {
      console.error('Error:', error);
      alert('수정 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchResponseDetails();
  }, [id]);

  if (isLoading) return <p>로딩 중...</p>;

  return (
    <TiptapEditor
      title={data.title}
      contentHtml={data.contentHtml}
      onChange={(updatedData) => setData(updatedData)}
      onSubmit={handleSubmit}
      mode="edit"
    />
  );
};

export default EditResponsePage;
