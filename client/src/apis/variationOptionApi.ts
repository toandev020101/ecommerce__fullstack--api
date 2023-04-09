import { ListParams, Response } from '../interfaces/common';
import { VariationOptionInput } from '../interfaces/VariationOptionInput';
import { VariationOption } from '../models/VariationOption';
import axiosCLient from './axiosClient';

export const getListByVariationId = (variationId: number): Promise<Response<VariationOption>> => {
  const url = `/variation-option/${variationId}`;
  return axiosCLient.get(url);
};

export const getListBySearchTermAndVariationId = (
  variationId: number,
  searchTerm: string,
): Promise<Response<VariationOption>> => {
  const url = `/variation-option/${variationId}/search`;
  return axiosCLient.get(url, { params: { searchTerm } });
};

export const getPaginationByVariationId = (
  variationId: number,
  params: ListParams,
): Promise<Response<VariationOption>> => {
  const url = `/variation-option/pagination/${variationId}`;
  return axiosCLient.get(url, { params });
};

export const getOneById = (id: number): Promise<Response<VariationOption>> => {
  const url = `/variation-option/${id}`;
  return axiosCLient.get(url);
};

export const addOne = (data: VariationOptionInput): Promise<Response<null>> => {
  const url = '/variation-option';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: VariationOptionInput): Promise<Response<null>> => {
  const url = `/variation-option/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/variation-option';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/variation-option/${id}`;
  return axiosCLient.delete(url);
};
