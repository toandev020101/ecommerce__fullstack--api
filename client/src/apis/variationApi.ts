import { ListParams, Response } from '../interfaces/common';
import { VariationInput } from '../interfaces/VariationInput';
import { Variation } from './../models/Variation';
import axiosCLient from './axiosClient';

export const getListByCategorySlugPublic = (categorySlug: string): Promise<Response<Variation>> => {
  const url = '/variation/any/public';
  return axiosCLient.get(url, { params: { categorySlug } });
};

export const getAll = (): Promise<Response<Variation>> => {
  const url = '/variation';
  return axiosCLient.get(url);
};

export const getPagination = (params: ListParams): Promise<Response<Variation>> => {
  const url = '/variation/pagination';
  return axiosCLient.get(url, { params });
};

export const getOneById = (id: number): Promise<Response<Variation>> => {
  const url = `/variation/${id}`;
  return axiosCLient.get(url);
};

export const addOne = (data: VariationInput): Promise<Response<null>> => {
  const url = '/variation';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: VariationInput): Promise<Response<null>> => {
  const url = `/variation/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/variation';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/variation/${id}`;
  return axiosCLient.delete(url);
};
