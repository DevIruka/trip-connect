import React from 'react';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  return (
    <div>
      <h1>Original</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data.original }}
        className="border p-4 mb-4 bg-gray-100"
      ></div>

      <h1>Translated</h1>
      <div
        dangerouslySetInnerHTML={{ __html: data.translated }}
        className="border p-4 bg-gray-100"
      ></div>
    </div>
  );
};

export default RenderTranslatedHTML;
