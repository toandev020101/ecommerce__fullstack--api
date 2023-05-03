export interface Order {
  id: number;
  fullName: string;
  phoneNumber: string;
  totalQuantity: number;
  totalPrice: number;
  street: string;
  wardId: number;
  ward: {
    id: number;
    name: string;
  };
  districtId: number;
  district: {
    id: number;
    name: string;
  };
  provinceId: number;
  province: {
    id: number;
    name: string;
  };
  note?: string;
  orderLines: [
    {
      id: number;
      variation: string;
      quantity: number;
      price: number;
      productItemId: number;
      productItem: {
        id: number;
        productId: number;
        product: {
          id: number;
          name: string;
        };
      };
    },
  ];
  orderCoupons: [
    {
      id: number;
      code: string;
      price: number;
    },
  ];
  orderStatusId: number;
  orderStatus: {
    id: number;
    name: string;
  };
  shipMethodId: number;
  shipMethod: {
    id: number;
    name: string;
    price: number;
  };
  paymentMethodId: number;
  paymentMethod: {
    id: number;
    name: string;
  };
  createdAt: Date;
}
