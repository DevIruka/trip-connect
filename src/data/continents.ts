export type Continent = {
  name: string;
  cities: string[];
};

export const continents: Continent[] = [
  { name: '아시아', cities: ['서울', '도쿄', '방콕', '싱가포르'] },
  { name: '유럽', cities: ['런던', '파리', '로마', '베를린'] },
  { name: '북미', cities: ['뉴욕', '로스앤젤레스', '토론토', '시애틀'] },
  { name: '오세아니아', cities: ['시드니', '멜버른', '오클랜드'] },
  { name: '기타', cities: ['두바이', '이스탄불', '모스크바'] },
];
