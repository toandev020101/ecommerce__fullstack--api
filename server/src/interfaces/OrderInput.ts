export interface OrderInput {
  fullName: string;
  phoneNumber: string;
  totalQuantity: number;
  totalPrice: number;
  street: string;
  wardId: number;
  districtId: number;
  provinceId: number;
  note?: string;
  shipMethodId: number;
  paymentMethodId: number;
  orderStatusId?: number;
  lines: {
    variation: string;
    quantity: number;
    price: number;
    productItemId: number;
  }[];
  coupons?: {
    code: string;
    price: number;
  }[];
}
