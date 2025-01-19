'use client';

import React, { useEffect, useState } from 'react';
import { Editor, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import EditorContent from './EditorContent';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import FontFamily from '@tiptap/extension-font-family';
import MapNode from './MapNode';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

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

  const extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder: ({ node }) =>
        node.type.name === 'paragraph'
          ? '답변을 입력해 주세요'
          : '내용을 작성해 주세요',
    }),
    TextStyle,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    FontFamily,
    MapNode,
  ];

  const editor = useEditor({
    extensions,
    content: contentHtml || '',
    onUpdate: ({ editor }) => {
      const updatedContentHtml = editor.getHTML();
      onChange({
        title: localTitle,
        contentHtml: updatedContentHtml,
        freeContent,
      });
    },
    onFocus: ({ editor }) => setActiveEditor(editor),
    editorProps: {
      attributes: {
        class: 'outline-none ProseMirror min-h-[150px]',
      },
    },
  });

  const previewEditor = useEditor({
    extensions,
    content: freeContent || '',
    onUpdate: ({ editor }) => {
      onChange({
        title: localTitle,
        contentHtml,
        freeContent: editor.getHTML(),
      });
    },
    onFocus: ({ editor }) => setActiveEditor(editor),
    editorProps: {
      attributes: {
        class: 'outline-none ProseMirror min-h-[150px]',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      setActiveEditor(editor); // 초기 activeEditor 설정
    }
  }, [editor]);

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
      <div className="mb-[24px]">
        <label className="sr-only">제목</label>
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="제목"
          className="w-full px-3 py-2 bg-transparent border-0 border-b text-[#A9A9A9] focus:outline-none focus:ring-0 focus:border-[#DFE1E5] text-[18px] font-bold text-[#000000]"
          />
      </div>

      <div className="mb-[24px]">
        <div className="relative rounded-[8px] border border-[#DFE1E5]">
        <div className="px-[16px] py-[14px] absolute inset-0 pointer-events-none flex text-[#A9A9A9] text-[14px] font-m">
        {!previewEditor?.getText() && '미리보기 답변을 작성해 주세요'}
          </div>
          <div className="rounded-[8px]">
            <EditorContent editor={previewEditor} />
          </div>
        </div>
      </div>

      <div className="relative my-[16px] flex items-center justify-center">
        <div className="flex-grow border-t border-[#DFE1E5]"></div>
        <p className="px-4 text-sm whitespace-nowrap bg-white text-[#80BFFF]">
          이후로는 유료 결제자만 볼 수 있어요
        </p>
        <div className="flex-grow border-t border-[#DFE1E5]"></div>
      </div>

      <div className="mb-4">
        <MenuBar editor={activeEditor} />
        <div className="relative rounded-[8px] border border-[#DFE1E5]">
        <div className="px-[16px] py-[14px] absolute inset-0 pointer-events-none flex text-[#A9A9A9] text-[14px] font-m">
            {!editor?.getText() && '유료 분량의 답변을 작성해 주세요'}
          </div>
          <div className="rounded-[8px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
