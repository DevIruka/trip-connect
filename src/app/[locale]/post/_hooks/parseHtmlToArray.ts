import { parsedData } from '../_types/parsedData';

type AccType = {
  [key: string]: string;
};

export const parseHtmlToArray = (htmlString: string | undefined) => {
  // DOMParser를 사용하여 HTML 문자열을 DOM으로 변환
  const parser = new DOMParser();
  const doc: Document = parser.parseFromString(
    htmlString ? htmlString : '',
    'text/html',
  );

  // 결과를 담을 배열
  const resultArray: parsedData[] = [];

  // body의 모든 자식 노드를 순회

  doc.body.childNodes.forEach((node) => {
    // 노드가 요소일 경우

    // node 타입이 Element 타입이야
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      resultArray.push({
        type: 'element',
        tag: element.tagName.toLowerCase(),
        attributes: element.attributes
          ? Array.from(element.attributes).reduce((acc: AccType, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {})
          : {},
        content: element.innerHTML.trim(), // 내부 HTML을 저장
      });
    }

    // 텍스트 노드일 경우

    if (node.nodeType === Node.TEXT_NODE) {
      const element = node as Text;
      resultArray.push({
        type: 'text',
        content: element.textContent ? element.textContent.trim() : '',
      });
    }
  });

  return resultArray;
};
