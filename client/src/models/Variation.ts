export interface Variation {
  id: number;
  name: string;
  slug: string;
  variationOptions?: [
    {
      id: number;
      value: string;
    },
  ];
}
