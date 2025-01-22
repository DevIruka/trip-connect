export type parsedData = {
  type: string;
  tag?: string;
  attributes?: {
    'data-type'?: string;
    lat?: string;
    lng?: string;
    name?: string;
    address?: string;
    src?: string;
  };
  content: string;
};
