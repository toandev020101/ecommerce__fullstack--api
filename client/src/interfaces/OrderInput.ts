export interface OrderInput {
  fullName: string;
  phoneNumber: string;
  totalQuantity: number;
  totalPrice: number;
  street: string;
  wardId: number | string;
  districtId: number | string;
  provinceId: number | string;
  note?: string;
  shipMethodId: number;
  paymentMethodId: number;
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

  [key: string]: any;
}
