import MapComponent from '@/app/post/_components/MapComponent2';

export const ContentRenderer = ({ parsedArray }) => {
  console.log(parsedArray);
  return (
    <div className="content-container">
      {parsedArray.map((item, index) => {
        // `data-type="map"`인지 확인
        if (item.type === 'element' && item.attributes['data-type'] === 'map') {
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
        if (item.type === 'element' && item.tag === 'img') {
          return (
            <img
              key={index}
              src={item.attributes.src}
              alt="Content"
              style={{ maxWidth: '100%', margin: '20px 0' }}
            />
          );
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

// // App 컴포넌트에서 사용
// const App = () => {
//   return <ContentRenderer parsedArray={parsedArray} />;
// };

// export default App;
