import { ProductInput } from '../interfaces/ProductInput';
import { ListParams, Response } from '../interfaces/common';
import { Product } from '../models/Product';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Product>> => {
  const url = '/product';
  return axiosCLient.get(url);
};

export const getListBySearchTerm = (searchTerm: string): Promise<Response<Product>> => {
  const url = '/product/search';
  return axiosCLient.get(url, { params: { searchTerm } });
};

export const getListByIds = (ids: number[]): Promise<Response<Product>> => {
  const url = '/product/ids';
  return axiosCLient.get(url, { params: { ids } });
};

export const getPaginationByCategorySlugPublic = (params: ListParams): Promise<Response<Product>> => {
  const url = '/product/pagination/public';
  return axiosCLient.get(url, { params });
};

export const getPagination = (params: ListParams): Promise<Response<Product>> => {
  const url = '/product/pagination';
  return axiosCLient.get(url, { params });
};

export const getOneBySlugPublic = (slug: string): Promise<Response<Product>> => {
  const url = `/product/${slug}/public`;
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<Product>> => {
  const url = `/product/${id}`;
  return axiosCLient.get(url);
};

export const addAny = (data: ProductInput[]): Promise<Response<null>> => {
  const url = '/product/any';
  return axiosCLient.post(url, data);
};

export const addOne = (data: ProductInput): Promise<Response<null>> => {
  const url = '/product';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: ProductInput): Promise<Response<null>> => {
  const url = `/product/${id}`;
  return axiosCLient.put(url, data);
};

export const changeActive = (id: number, data: { isActive: number }): Promise<Response<null>> => {
  const url = `/product/${id}`;
  return axiosCLient.patch(url, data);
};

export const changeHot = (id: number, data: { isHot: number }): Promise<Response<null>> => {
  const url = `/product/${id}`;
  return axiosCLient.patch(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/product';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/product/${id}`;
  return axiosCLient.delete(url);
};
