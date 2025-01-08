import React from 'react';
import TiptapEditor from './_components/TiptapEditor';

const ResponsePage: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">답변 작성</h1>
      <TiptapEditor />
    </div>
  );
};

export default ResponsePage;
