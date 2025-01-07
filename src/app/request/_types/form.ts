export type FormInputs = {
  location: string;
  topic: string;
  title: string;
  credit: number;
  content: string;
  deadline: Date | undefined;
};

export type Continent = {
  name: string;
  cities: string[];
};
