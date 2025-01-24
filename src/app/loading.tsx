import Image from 'next/image';

const thehand = '/images/thehand.svg';

const LoadingPage = () => {
  return (
    <div className="inner menuscrollbar">
      <div className="w-full h-[196px] flex-col justify-start items-center inline-flex mt-[128px]">
        <Image src={thehand} width={100} height={100} alt="wait!" />
        <div className="mt-[32px] self-stretch text-center text-[#44484c] text-xl font-bold leading-loose">
          조금만 기다려 주세요!
          <br />
          화면을 불러오는 중이에요.
        </div>
      </div>
    </div>
  );
};
export default LoadingPage;
