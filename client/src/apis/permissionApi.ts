import { ListParams, Response } from '../interfaces/common';
import { PermissionInput } from '../interfaces/PermissionInput';
import { Permission } from '../models/Permission';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Permission>> => {
  const url = '/permission';
  return axiosCLient.get(url);
};

export const getPaginationAndRole = (params: ListParams): Promise<Response<Permission>> => {
  const url = '/permission/pagination/role';
  return axiosCLient.get(url, { params });
};

export const addOne = (data: PermissionInput): Promise<Response<null>> => {
  const url = `/permission`;
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: PermissionInput): Promise<Response<null>> => {
  const url = `/permission/${id}`;
  return axiosCLient.put(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = `/permission`;
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/permission/${id}`;
  return axiosCLient.delete(url);
};
