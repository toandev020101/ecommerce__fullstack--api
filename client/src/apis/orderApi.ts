import { ListParams, Response } from '../interfaces/common';
import { OrderInput } from '../interfaces/OrderInput';
import { Order } from '../models/Order';
import axiosCLient from './axiosClient';

export const getListByStatusId = (orderStatusId: number): Promise<Response<Order>> => {
  const url = '/order';
  return axiosCLient.get(url, { params: { orderStatusId } });
};

export const getPagination = (params: ListParams): Promise<Response<Order>> => {
  const url = '/order/pagination';
  return axiosCLient.get(url, { params });
};

export const getOneById = (id: number): Promise<Response<Order>> => {
  const url = `/order/${id}`;
  return axiosCLient.get(url);
};

export const addOne = (data: OrderInput): Promise<Response<null>> => {
  const url = '/order';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: OrderInput): Promise<Response<null>> => {
  const url = `/order/${id}`;
  return axiosCLient.put(url, data);
};

export const changeStatus = (id: number, data: { orderStatusId: number }): Promise<Response<null>> => {
  const url = `/order/${id}`;
  return axiosCLient.patch(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/order';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/order/${id}`;
  return axiosCLient.delete(url);
};
