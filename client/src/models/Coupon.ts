export interface Coupon {
  id: number;
  name: string;
  priceMaxName: string;
  code: string;
  discountValue: number;
  priceMax: number;
  type: number;
  quantity: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}
