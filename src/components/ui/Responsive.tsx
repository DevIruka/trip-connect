import { useMediaQuery } from 'react-responsive';

export const Desktop = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isDesktop = useMediaQuery({ minWidth: 800 });
  return isDesktop ? children : null;
};

export const Mobile = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isMobile = useMediaQuery({ maxWidth: 799 });
  return isMobile ? children : null;
};
