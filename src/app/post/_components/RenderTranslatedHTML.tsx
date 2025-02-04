import React from 'react';
import { parseHtmlToArray } from '../_utils/parseHtmlToArray';
import { ContentRenderer } from './ContentRenderer';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  const contentArray = parseHtmlToArray(data.translated);
  return <ContentRenderer parsedArray={contentArray} />;
};

export default RenderTranslatedHTML;
