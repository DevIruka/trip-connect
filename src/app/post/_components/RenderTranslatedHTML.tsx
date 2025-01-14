import React from 'react';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  return <div dangerouslySetInnerHTML={{ __html: data.translated! }}></div>;
};

export default RenderTranslatedHTML;
