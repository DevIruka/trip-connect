import React from 'react';

const RenderTranslatedHTML = ({
  data,
}: {
  data: { original: string | undefined; translated: string | undefined };
}) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.original!, 'text/html');

  // <div data-type="map"> 요소 추출
  const mapElement = doc.querySelector('div[data-type="map"]');
  const mapData = mapElement
    ? {
        lat: mapElement.getAttribute('lat'),
        lng: mapElement.getAttribute('lng'),
        name: mapElement.getAttribute('name'),
        address: mapElement.getAttribute('address'),
      }
    : null;

  console.log(mapData);

  return <div dangerouslySetInnerHTML={{ __html: data.translated! }}></div>;
};

export default RenderTranslatedHTML;
