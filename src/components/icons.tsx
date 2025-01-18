import Image from 'next/image';
import foodIcon from '@/data/images/🥘 납작한 냄비.svg';
import shoppingIcon from '@/data/images/🛍️ 쇼핑백.svg';
import lodgingIcon from '@/data/images/🛏️ 침대.svg';
import eventIcon from '@/data/images/🎉 파티.svg';
import scheduleExpensesIcon from '@/data/images/💰️ 돈주머니.svg';
import cultureIcon from '@/data/images/🌏️ 아시아와 호주가 보이는 지구.svg';
import historyIcon from '@/data/images/📚️ 책 여러 권.svg';
import activityIcon from '@/data/images/🎿 스키.svg';
import etcIcon from '@/data/images/⁉️ 느낌표와 물음표.svg';
import eyes from '@/data/images/👀 왕눈이 눈알.svg';

const Icon = ({ type, size = 20 }: { type: string; size: number }) => {
  const iconStyle = { width: size, height: size, paddingRight: '4px' };

  switch (type) {
    case 'food':
      return (
        <Image
          src={foodIcon}
          alt="Food Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'shopping':
      return (
        <Image
          src={shoppingIcon}
          alt="Shopping Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'lodging':
      return (
        <Image
          src={lodgingIcon}
          alt="lodging Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'event':
      return (
        <Image
          src={eventIcon}
          alt="event Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'schedule-expenses':
      return (
        <Image
          src={scheduleExpensesIcon}
          alt="schedule-expenses Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'culture':
      return (
        <Image
          src={cultureIcon}
          alt="culture Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'history':
      return (
        <Image
          src={historyIcon}
          alt="history Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'activity':
      return (
        <Image
          src={activityIcon}
          alt="activity Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    case 'etc':
      return (
        <Image
          src={etcIcon}
          alt="etc Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
    default:
      return (
        <Image
          src={eyes}
          alt="eyes Icon"
          width={0}
          height={0}
          style={iconStyle}
        />
      );
  }
};

export default Icon;
