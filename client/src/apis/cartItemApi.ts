import { CartItemInput } from '../interfaces/CartItemInput';
import { Response } from '../interfaces/common';
import { CartItem } from '../models/CartItem';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<CartItem>> => {
  const url = '/cart-item';
  return axiosCLient.get(url);
};

export const addAny = (data: CartItemInput[]): Promise<Response<null>> => {
  const url = '/cart-item/any';
  return axiosCLient.post(url, data);
};

export const addOne = (data: CartItemInput): Promise<Response<null>> => {
  const url = '/cart-item';
  return axiosCLient.post(url, data);
};

export const changeProductItem = (id: number, data: { productItemId: number }): Promise<Response<null>> => {
  const url = `/cart-item/${id}/product-item`;
  return axiosCLient.patch(url, data);
};

export const changeQuantity = (id: number, data: { quantity: number }): Promise<Response<null>> => {
  const url = `/cart-item/${id}/quantity`;
  return axiosCLient.patch(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/cart-item';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/cart-item/${id}`;
  return axiosCLient.delete(url);
};
