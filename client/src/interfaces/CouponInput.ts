export interface CouponInput {
  name: string;
  code: string;
  discountValue: number;
  priceMax: number;
  type: number;
  startDate: Date;
  endDate: Date;
}
