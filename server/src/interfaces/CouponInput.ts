export interface CouponInput {
  name: string;
  priceMaxName?: string;
  code: string;
  discountValue: number;
  priceMax?: number;
  type: number;
  quantity: number;
  startDate: Date | string;
  endDate: Date | string;
}
