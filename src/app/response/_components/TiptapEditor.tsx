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
  freeContent: string;
  onChange: (content: {
    title: string;
    contentHtml: string;
    freeContent: string;
  }) => void;
};

const TiptapEditor: React.FC<Props> = ({
  title,
  contentHtml,
  freeContent,
  onChange,
}) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      FontFamily,
      MapNode,
    ],
    content: contentHtml,
    onUpdate: ({ editor }) => {
      const contentHtml = editor.getHTML();
      onChange({
        title: localTitle,
        contentHtml: editor.getHTML(),
        freeContent,
      });
    },
    onFocus: ({ editor }) => setActiveEditor(editor),
    editorProps: {
      attributes: {
        class: 'outline-none',
        placeholder: '미리보기 답변을 작성해 주세요', 
      },
    },
  });

  const previewEditor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      FontFamily,
      MapNode,
    ],
    content: freeContent,
    onUpdate: ({ editor }) => {
      onChange({
        title: localTitle,
        contentHtml,
        freeContent: editor.getHTML(),
      });
    },
    onFocus: ({ editor }) => setActiveEditor(editor),
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onChange({
      title: e.target.value,
      contentHtml,
      freeContent,
    });
  };

  return (
    <div className="p-4 pb-16">
      <div className="mb-4">
        <label className="sr-only">제목</label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="제목"
          className="w-full px-3 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-500"
        />
      </div>

      <div className="mb-4">
        <EditorContent
          editor={previewEditor}
        />
      </div>

      <div className="relative my-4 flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <p className="px-4 text-sm text-gray-500 whitespace-nowrap bg-white">
          이후로는 유료 결제자만 볼 수 있어요
        </p>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="mb-4">
        <MenuBar editor={activeEditor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
