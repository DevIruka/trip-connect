import React from 'react';
import { parseHtmlToArray } from '../_hooks/parseHtmlToArray';
import { ContentRenderer } from './MapComponent';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  const aaa = parseHtmlToArray(data.translated);

  return <ContentRenderer parsedArray={aaa} />; //1. 리턴 맵데이터 함수 2. 호출하면 맵데이터로 구글 지도 그리는 컴포넌트를 만들어서 (파일 구분) 3.
};

export default RenderTranslatedHTML;
