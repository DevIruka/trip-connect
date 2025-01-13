import React from 'react';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: data.translated }}></div>
    </div>
  );
};

export default RenderTranslatedHTML;
