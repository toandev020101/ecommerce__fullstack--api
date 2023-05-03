import { ListParams } from './../interfaces/common';
import { Response } from '../interfaces/common';
import { User } from '../models/User';
import axiosCLient from './axiosClient';
import { UserInput } from '../interfaces/UserInput';

export const getAllAndRole = (): Promise<Response<User>> => {
  const url = '/user/role';
  return axiosCLient.get(url);
};

export const getPaginationAndRole = (params: ListParams): Promise<Response<User>> => {
  const url = '/user/pagination/role';
  return axiosCLient.get(url, { params });
};

export const getOneAndRoleByIdPublic = (id: number): Promise<Response<User>> => {
  const url = `/user/public/${id}/role`;
  return axiosCLient.get(url);
};

export const getOneAndRoleById = (id: number): Promise<Response<User>> => {
  const url = `/user/${id}/role`;
  return axiosCLient.get(url);
};

export const addAny = (data: UserInput[]): Promise<Response<null>> => {
  const url = '/user/any';
  return axiosCLient.post(url, data);
};

export const addOne = (data: UserInput): Promise<Response<null>> => {
  const url = '/user';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: UserInput): Promise<Response<null>> => {
  const url = `/user/${id}`;
  return axiosCLient.put(url, data);
};

export const changeActive = (id: number, data: { isActive: number }): Promise<Response<null>> => {
  const url = `/user/${id}`;
  return axiosCLient.patch(url, data);
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = '/user';
  return axiosCLient.delete(url, { data: { ids } });
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/user/${id}`;
  return axiosCLient.delete(url);
};
