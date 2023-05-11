import { ListParams, Response } from '../interfaces/common';
import { ReviewInput } from '../interfaces/ReviewInput';
import { Review } from '../models/Review';
import axiosCLient from './axiosClient';

export const getPaginationByProductId = (productId: number, params: ListParams): Promise<Response<Review>> => {
  const url = `/review/pagination/${productId}`;
  return axiosCLient.get(url, { params });
};

export const getPagination = (params: ListParams): Promise<Response<Review>> => {
  const url = '/review/pagination';
  return axiosCLient.get(url, { params });
};

export const getListByProductId = (productId: number): Promise<Response<Review>> => {
  const url = `/review/product/${productId}`;
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<Review>> => {
  const url = `/review/${id}`;
  return axiosCLient.get(url);
};

export const getOneByOrderLinedId = (orderLinedId: number): Promise<Response<Review>> => {
  const url = `/review/order-line/${orderLinedId}`;
  return axiosCLient.get(url);
};

export const addOne = (data: ReviewInput): Promise<Response<null>> => {
  const url = '/review';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: ReviewInput): Promise<Response<null>> => {
  const url = `/review/${id}`;
  return axiosCLient.put(url, data);
};

export const changeStatus = (id: number, status: number): Promise<Response<null>> => {
  const url = `/review/${id}`;
  return axiosCLient.patch(url, { status });
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/review';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/review/${id}`;
  return axiosCLient.delete(url);
};
