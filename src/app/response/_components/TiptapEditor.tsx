'use client';

import React, { useEffect, useState } from 'react';
import { Editor, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import EditorContent from './EditorContent';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import FontFamily from '@tiptap/extension-font-family';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

const TiptapEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const router = useRouter();
  const { requestId } = useParams(); // 나중에 디테일 페이지에서 request_id 가져오기
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      FontFamily,
    ],
    content: '<p>답변을 작성하세요...</p>',
  });

  const handleSubmit = async () => {
    if (!editor) {
      alert('에디터가 초기화되지 않았습니다.');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    const contentHtml = editor.getHTML(); // 에디터 컨텐츠 가져오기

    try {
      const { error } = await supabase.from('response_posts').insert([
        {
          user_id: '0fdbd37c-1b2e-4142-b50b-e593f13487a7', // 이거 나중에 전역에서 가져올거임
          request_id: '115e646f-39ab-4e1d-bda7-d9660f1fbb97', // 요청 ID
          title,
          content_html: contentHtml,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      alert('답변이 성공적으로 등록되었습니다!');
      router.push(`/request/${requestId}`); // 원래 게시글로 리다이렉트 해줌줌
    } catch (error) {
      console.error('오류 발생:', error);
      alert('답변 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4">
      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="답변 제목을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        등록
      </button>
    </div>
  );
};

export default TiptapEditor;
