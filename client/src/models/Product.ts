export interface ProductItem {
  id: number;
  SKU?: string;
  imageUrl?: string;
  productId: number;
  inventoryId: number;
  price: number;
  discount: number;
  discountStartDate: Date;
  discountEndDate: Date;
  inventory: {
    id: number;
    quantity: number;
    priceEntry?: number;
    locationCode?: string;
  };
  productImages?: [
    {
      id: number;
      imageUrl: string;
    },
  ];
  productConfigurations?: [
    {
      id: number;
      variationOption: {
        id: number;
        value: string;
        slug: string;
        variationId: number;
        variation?: {
          id: number;
          name: string;
          slug: string;
        };
      };
    },
  ];

  product?: Product;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  imageUrl: string;
  isHot: number;
  isActive: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;

  category: {
    id: number;
    name: string;
    slug: string;
  };
  productTags?: [
    {
      id: number;
      productId: number;
      tagId: number;
      tag: {
        id: number;
        name: string;
      };
    },
  ];
  productConnects?: [
    {
      id: number;
      productId: number;
      connectId: number;
      connect: {
        id: number;
        name: string;
      };
    },
  ];

  productItems: ProductItem[];

  createdAt?: Date;
  updatedAt?: Date;
}
