import React from 'react';
import { Editor, EditorContent as TiptapEditorContent } from '@tiptap/react';

type Props = {
  editor: Editor | null;
};

const EditorContent: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded p-4 min-h-[150px]">
    {/* 에디터가 비어있을 때 플레이스홀더 표시 */}
    {editor.isEmpty && (
      <p className="text-gray-400 select-none">
        유료 분량의 답변을 작성해 주세요
      </p>
    )}

    {/* Tiptap 에디터 콘텐츠 */}
    <TiptapEditorContent
      editor={editor}
      className="w-full h-full outline-none"
    />
  </div>
  );
};

export default EditorContent;
