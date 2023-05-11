import { PaymentMethodInput } from '../interfaces/PaymentMethodInput';
import { ListParams, Response } from '../interfaces/common';
import { PaymentMethod } from '../models/PaymentMethod';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<PaymentMethod>> => {
  const url = '/payment-method';
  return axiosCLient.get(url);
};

export const getPagination = (params: ListParams): Promise<Response<PaymentMethod>> => {
  const url = '/payment-method/pagination';
  return axiosCLient.get(url, { params });
};

export const addOne = (data: PaymentMethodInput): Promise<Response<null>> => {
  const url = '/payment-method';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: PaymentMethodInput): Promise<Response<null>> => {
  const url = `/payment-method/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/payment-method';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/payment-method/${id}`;
  return axiosCLient.delete(url);
};
