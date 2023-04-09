import { ListParams, Response } from '../interfaces/common';
import { TagInput } from '../interfaces/TagInput';
import { Tag } from '../models/Tag';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Tag>> => {
  const url = '/tag';
  return axiosCLient.get(url);
};

export const getListBySearchTerm = (searchTerm: string): Promise<Response<Tag>> => {
  const url = '/tag/search';
  return axiosCLient.get(url, { params: { searchTerm } });
};

export const getPagination = (params: ListParams): Promise<Response<Tag>> => {
  const url = '/tag/pagination';
  return axiosCLient.get(url, { params });
};

export const getOneById = (id: number): Promise<Response<Tag>> => {
  const url = `/tag/${id}`;
  return axiosCLient.get(url);
};

export const addOne = (data: TagInput): Promise<Response<null>> => {
  const url = '/tag';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: TagInput): Promise<Response<null>> => {
  const url = `/tag/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/tag';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/tag/${id}`;
  return axiosCLient.delete(url);
};
