export interface Coupon {
  id: number;
  name: string;
  code: string;
  discountValue: number;
  priceMax: number;
  type: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}
