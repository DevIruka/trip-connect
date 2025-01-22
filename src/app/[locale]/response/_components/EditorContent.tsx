import React from 'react';
import { Editor, EditorContent as TiptapEditorContent } from '@tiptap/react';

type Props = {
  editor: Editor | null;
  className?: string;
};

const EditorContent: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border border-[#DFE1E5] rounded-[8px] p-3 ProseMirror">
      <TiptapEditorContent editor={editor} />
    </div>
  );
};

export default EditorContent;
