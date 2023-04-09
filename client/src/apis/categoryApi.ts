import { CategoryInput } from '../interfaces/CategoryInput';
import { ListParams } from '../interfaces/common';
import { Response } from '../interfaces/common';
import { Category } from '../models/Category';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Category>> => {
  const url = '/category';
  return axiosCLient.get(url);
};

export const getPaginationAndParent = (params: ListParams): Promise<Response<Category>> => {
  const url = '/category/pagination/parent';
  return axiosCLient.get(url, { params });
};

export const getOneAndParentById = (id: number): Promise<Response<Category>> => {
  const url = `/category/${id}/parent`;
  return axiosCLient.get(url);
};

export const addOne = (data: CategoryInput): Promise<Response<null>> => {
  const url = '/category';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: CategoryInput): Promise<Response<null>> => {
  const url = `/category/${id}`;
  return axiosCLient.put(url, data);
};

export const changeActive = (id: number, data: { isActive: number }): Promise<Response<null>> => {
  const url = `/category/${id}`;
  return axiosCLient.patch(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/category';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/category/${id}`;
  return axiosCLient.delete(url);
};
