export const parseHtmlToArray = (htmlString) => {
  // DOMParser를 사용하여 HTML 문자열을 DOM으로 변환
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // 결과를 담을 배열
  const resultArray = [];

  // body의 모든 자식 노드를 순회
  doc.body.childNodes.forEach((node) => {
    // 노드가 요소일 경우
    if (node.nodeType === Node.ELEMENT_NODE) {
      resultArray.push({
        type: 'element',
        tag: node.tagName.toLowerCase(),
        attributes: node.attributes
          ? [...node.attributes].reduce((acc, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {})
          : {},
        content: node.innerHTML.trim(), // 내부 HTML을 저장
      });
    }

    // 텍스트 노드일 경우
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      resultArray.push({
        type: 'text',
        content: node.textContent.trim(),
      });
    }
  });

  return resultArray;
};
