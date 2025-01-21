import React from 'react';
import { parseHtmlToArray } from '../_hooks/parseHtmlToArray';
import { ContentRenderer } from './MapComponent';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  const contentArray = parseHtmlToArray(data.translated);
  return <ContentRenderer parsedArray={contentArray} />;
};

export default RenderTranslatedHTML;
