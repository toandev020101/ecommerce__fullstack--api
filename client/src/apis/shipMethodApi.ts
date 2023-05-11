import { ShipMethodInput } from '../interfaces/ShipMethodInput';
import { ListParams, Response } from '../interfaces/common';
import { ShipMethod } from '../models/ShipMethod';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<ShipMethod>> => {
  const url = '/ship-method';
  return axiosCLient.get(url);
};

export const getPagination = (params: ListParams): Promise<Response<ShipMethod>> => {
  const url = '/ship-method/pagination';
  return axiosCLient.get(url, { params });
};

export const addOne = (data: ShipMethodInput): Promise<Response<null>> => {
  const url = '/ship-method';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: ShipMethodInput): Promise<Response<null>> => {
  const url = `/ship-method/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/ship-method';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/ship-method/${id}`;
  return axiosCLient.delete(url);
};
