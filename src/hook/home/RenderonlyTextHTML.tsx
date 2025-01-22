

import { parseHtmlToArray } from '@/app/[locale]/post/_hooks/parseHtmlToArray';
import { parsedData } from '@/app/[locale]/post/_types/parsedData';
import React from 'react';
const ContentRenderer = ({ parsedArray }: { parsedArray: parsedData[] }) => {
  return (
    <div className="grid gap-4">
      {parsedArray.map((item, index) => {
        // `data-type="map"`인지 확인
        if (
          (item.attributes && item.attributes['data-type'] === 'map') ||
          item.tag === 'img'
        ) {
          return null;
        }

        if (item.type === 'element' && item.tag === 'p') {
          return (
            <p key={index} dangerouslySetInnerHTML={{ __html: item.content }} />
          );
        }

        // 기본적으로 아무것도 렌더링하지 않음
        return null;
      })}
    </div>
  );
};

const RenderonlyTextHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  const contentArray = parseHtmlToArray(data.translated);
  return <ContentRenderer parsedArray={contentArray} />;
};

export default RenderonlyTextHTML;
