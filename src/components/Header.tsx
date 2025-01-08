import Image from 'next/image';
import { GrSearch } from 'react-icons/gr';
import { LuBell } from 'react-icons/lu';

const logoImage = '/images/logo.png';

const Header = () => {
  return (
    <>
      <div className="flex flex-row sticky top-0 bg-white z-50 w-full justify-between">
        <Image
          src={logoImage}
          alt="트립 커넥트 로고."
          width={150}
          height={50}
          className="ml-3 p-2"
        />
        <div className="flex flex-row items-center justify-center gap-2">
          <GrSearch size={25} />
          <LuBell size={25} />
        </div>
      </div>
    </>
  );
};
export default Header;
