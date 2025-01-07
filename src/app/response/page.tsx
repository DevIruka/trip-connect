import React from 'react';
import TiptapEditor from './_components/TiptapEditor';

const ResponsePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tiptap Editor Demo</h1>
      <TiptapEditor />
    </div>
  );
};

export default ResponsePage;
