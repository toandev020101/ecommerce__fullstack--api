import { ListParams, Response } from '../interfaces/common';
import { CouponInput } from '../interfaces/CouponInput';
import { Coupon } from '../models/Coupon';
import axiosCLient from './axiosClient';

export const getAllPublic = (): Promise<Response<Coupon>> => {
  const url = '/coupon';
  return axiosCLient.get(url);
};

export const getPagination = (params: ListParams): Promise<Response<Coupon>> => {
  const url = '/coupon/pagination';
  return axiosCLient.get(url, { params });
};

export const checkOne = (code: string): Promise<Response<Coupon>> => {
  const url = `/coupon/${code}`;
  return axiosCLient.get(url);
};

export const addOne = (data: CouponInput): Promise<Response<null>> => {
  const url = '/coupon';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: CouponInput): Promise<Response<null>> => {
  const url = `/coupon/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/coupon';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/coupon/${id}`;
  return axiosCLient.delete(url);
};
