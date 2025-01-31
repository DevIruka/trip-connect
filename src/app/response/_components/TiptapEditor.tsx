'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

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
  const { t } = useTranslation('response');
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 799 });

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
        title,
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
        title,
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
      setActiveEditor(editor);
    }
  }, [editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedTitle = e.target.value;

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    onChange({
      title: updatedTitle,
      contentHtml: editor?.getHTML() || '',
      freeContent: previewEditor?.getHTML() || '',
    });
  };

  return (
    <>
      <div className="px-5 pb-0 w-full max-w-[800px] mx-auto md:px-0">
        <div className="hidden md:block">
          <MenuBar editor={activeEditor} />
        </div>

        <div className="md:px-[20px]">
          <div className="mb-[24px] md:mb-[12px]">
            <label className="sr-only">{t('titlePlaceholder')}</label>
            <textarea
              ref={textareaRef}
              value={title}
              onChange={handleTitleChange}
              placeholder={t('titlePlaceholder')}
              className="w-full py-2 bg-transparent border-0 border-b max-w-[800px] focus:outline-none focus:ring-0 focus:border-[#DFE1E5] placeholder:text-[#A9A9A9] text-[18px] font-bold resize-none md:px-[16px] md:py-[8px]"
              style={{
                color: '#000000',
                lineHeight: '1.5',
                overflow: 'hidden',
              }}
              rows={1}
            />
          </div>

          <div className="mb-[24px] md:mb-[12px]">
            <div className="relative rounded-[8px] border border-[#DFE1E5] md:border-transparent">
              <div className=" px-[16px] py-[14px] absolute inset-0 pointer-events-none flex text-[#A9A9A9] text-[14px] font-m md:border-transparent">
                {!previewEditor?.getText() && t('previewPlaceholder')}
              </div>
              <div className="rounded-[8px] md:min-h-[210px]">
                <EditorContent editor={previewEditor} />
              </div>
            </div>
          </div>

          <div className="relative my-[16px] flex items-center justify-center md:hidden">
            <div className="flex-grow border-t border-[#DFE1E5]"></div>
            <p className="px-4 text-sm whitespace-nowrap bg-white text-[#80BFFF]">
              {t('paidOnlyMessage')}
            </p>
            <div className="flex-grow border-t border-[#DFE1E5]"></div>
          </div>

          <div className="hidden md:block bg-[#f4f6f9] rounded-lg py-2 px-5 text-center md:mb-[12px]">
            <p className="text-[#0582ff] text-sm font-medium leading-tight">
              {t('paidOnlyMessage')}
            </p>
          </div>

          <div className="mb-[150px] md:mb-[12px]">
            <div className="relative rounded-[8px] border border-[#DFE1E5] md:border-transparent">
              <div className="px-[16px] py-[14px] absolute inset-0 pointer-events-none flex text-[#A9A9A9] text-[14px] font-m md:border-transparent">
                {!editor?.getText() && t('paidContentPlaceholder')}
              </div>
              <div className="rounded-[8px] md:min-h-[210px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full z-50 md:hidden">
        <MenuBar editor={activeEditor} />
      </div>
    </>
  );
};

export default TiptapEditor;
