import React from 'react';
import stripHtmlTags from '../_util/striptHtmlTags';

const ResponseContent: React.FC<{ html: string | undefined }> = ({ html }) => {
  const textContent = stripHtmlTags(html);
  return <p>{textContent}</p>;
};

export default ResponseContent;
