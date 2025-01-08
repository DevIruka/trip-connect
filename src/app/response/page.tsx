'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import TiptapEditor from './_components/TiptapEditor';

const ResponsePage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState({ title: '', contentHtml: '' });

  const request_id = '4076a3ed-2372-41ff-a6b7-b422bdabf0d0';
  const user_id = 'f7b9a432-75f7-4f6b-9fc6-fb429bdb32ac';

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('response_posts').insert([
        {
          user_id: 'f7b9a432-75f7-4f6b-9fc6-fb429bdb32ac',
          request_id: '4076a3ed-2372-41ff-a6b7-b422bdabf0d0',
          title: data.title,
          content_html: data.contentHtml,
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
    <TiptapEditor
      title={data.title}
      contentHtml={data.contentHtml}
      onChange={(updatedData) => setData(updatedData)}
      onSubmit={handleSubmit}
      mode="create"
    />
  );
};

export default ResponsePage;
