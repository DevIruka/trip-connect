import React from 'react';
import { Editor, EditorContent as TiptapEditorContent } from '@tiptap/react';

type Props = {
  editor: Editor | null;
};

const EditorContent: React.FC<Props> = ({ editor }) => {
  return (
    <TiptapEditorContent
      editor={editor}
      className="border border-gray-300 rounded p-2 min-h-[150px] focus:outline-none"
    />
  );
};

export default EditorContent;
