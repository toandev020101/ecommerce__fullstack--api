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
  variationCategories?: [
    {
      id: number;
      variationId: number;
      category: {
        id: number;
        name: string;
      };
    },
  ];
}
