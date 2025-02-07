import MapComponent from '@/app/post/_components/MapComponent';
import Image from 'next/image';
import { parsedData } from '../_types/parsedData';

export const ContentRenderer = ({
  parsedArray,
}: {
  parsedArray: parsedData[];
}) => {
  return (
    <div className="grid gap-4">
      {parsedArray.map((item, index) => {
        // `data-type="map"`인지 확인
        if (
          item.type === 'element' &&
          item.attributes &&
          item.attributes['data-type'] === 'map'
        ) {
          const { lat, lng, name, address } = item.attributes;
          return (
            <MapComponent
              key={index}
              lat={lat}
              lng={lng}
              name={name}
              address={address}
            />
          );
        }

        // 일반 텍스트나 이미지 렌더링
        if (
          item.type === 'element' &&
          item.tag === 'img' &&
          item.attributes &&
          item.attributes.src
        ) {
          return (
            <Image
              key={index}
              src={item.attributes.src}
              alt="Content"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          );
        }

        if (item.type === 'element') {
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
