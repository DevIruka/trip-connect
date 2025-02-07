export type FormInputs = {
  country_city: string;
  category: string[];
  title: string;
  credit: number;
  content: string;
  date_end: Date | undefined;
};

export type Continent = {
  name: string;
  cities: string[];
};
