import React from 'react';
import { Editor, EditorContent as TiptapEditorContent } from '@tiptap/react';

type Props = {
  editor: Editor | null;
};

const EditorContent: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded p-4 min-h-[150px]">
      <TiptapEditorContent
        editor={editor}
        className="w-full h-full outline-none"
      />
    </div>
  );
};

export default EditorContent;
