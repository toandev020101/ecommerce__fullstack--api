export interface ReviewInput {
  ratingValue: number;
  orderLinedId: number;
  comment: string;
  images: string[];
  type: number;
  status?: number;
  reviewId?: number;
}
