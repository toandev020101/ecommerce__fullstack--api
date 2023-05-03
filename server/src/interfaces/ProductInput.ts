export interface ProductInput {
  imageUrl: string;
  name: string;
  slug: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  categoryId: number;
  shortDescription: string;
  description: string;
  isHot: number;
  isActive: number;

  items: {
    idx: string;
    SKU: string;
    price: number;
    discount?: number;
    discountStartDate?: string | Date;
    discountEndDate?: string | Date;
    imageUrl: string;
    library: string[];
    inventory: {
      quantity: number;
      priceEntry: number;
      locationCode: string;
    };
  }[];

  connectIds: number[];

  tagIds: number[];
}
