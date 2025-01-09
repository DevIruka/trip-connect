'use client';

import React, { useState } from 'react';
import { Editor, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import EditorContent from './EditorContent';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import FontFamily from '@tiptap/extension-font-family';
import MapNode from './MapNode';
import TextStyle from '@tiptap/extension-text-style';

type Props = {
  title: string;
  contentHtml: string;
  onChange: (content: { title: string; contentHtml: string }) => void;
  onSubmit: () => void;
  mode: 'create' | 'edit';
};

const TiptapEditor: React.FC<Props> = ({ title, contentHtml, onChange, onSubmit, mode }) => {
  const [localTitle, setLocalTitle] = useState(title);

  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true }),
      FontFamily,
      MapNode,
    ],
    content: contentHtml,
    onUpdate: ({ editor }) => {
      const contentHtml = editor.getHTML();
      onChange({ title: localTitle, contentHtml });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onChange({ title: e.target.value, contentHtml });
  };

  return (
    <div className="p-4">
      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">제목</label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="답변 제목을 입력하세요"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <button
        onClick={onSubmit}
        className={`w-full text-white px-4 py-2 rounded ${mode === 'create' ? 'bg-blue-500' : 'bg-green-500'} hover:opacity-90`}
      >
        {mode === 'create' ? '등록' : '수정'}
      </button>
    </div>
  );
};

export default TiptapEditor;
