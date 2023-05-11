export interface Review {
  id: number;
  ratingValue: number;
  orderLinedId: number;
  comment: string;
  status: number;
  images: string[];
  type: number;
  reviewId: number;
  userId: number;
  user: {
    fullName: string;
    username: string;
    avatar: string;
  };
  orderLine: {
    id: number;
    variation: string;
    productItemId: number;
    productItem: {
      id: number;
      imageUrl: string;
      productId: number;
      product: {
        id: number;
        name: string;
      };
    };
  };
  reviewImages: {
    id: number;
    imageUrl: string;
  }[];
  createdAt: Date;
  reply: {
    id: number;
    type: number;
    status: number;
    user: {
      fullName: string;
      username: string;
      avatar: string;
      role: {
        name: string;
      };
    };
    comment: string;
    createdAt: Date;
  };
}
