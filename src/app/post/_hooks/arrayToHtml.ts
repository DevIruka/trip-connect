export const arrayToHtml = (elementsArray) => {
  return elementsArray
    .map((element) => {
      if (element.type === 'element') {
        const attributes = Object.entries(element.attributes || {})
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');

        // 태그를 열고, 내부 내용을 삽입 후 닫는 형식으로 생성
        return `<${element.tag}${attributes ? ' ' + attributes : ''}>${
          element.content || ''
        }</${element.tag}>`;
      }

      if (element.type === 'text') {
        return element.content; // 텍스트 노드는 그대로 반환
      }

      return '';
    })
    .join(''); // 모든 HTML 조각을 하나의 문자열로 합침
};
