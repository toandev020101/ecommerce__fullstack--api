import { Response } from '../interfaces/common';
import { RolePermissionInput } from '../interfaces/RolePermissionInput';
import { Role } from '../models/Role';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Role>> => {
  const url = '/role';
  return axiosCLient.get(url);
};

export const getAllAndUser = (): Promise<Response<Role>> => {
  const url = '/role/user';
  return axiosCLient.get(url);
};

export const getOneAndPermissionById = (id: number): Promise<Response<Role>> => {
  const url = `/role/${id}/permission`;
  return axiosCLient.get(url);
};

export const addOne = (data: RolePermissionInput): Promise<Response<null>> => {
  const url = '/role';
  return axiosCLient.post(url, data);
};

export const updateOne = (id: number, data: RolePermissionInput): Promise<Response<null>> => {
  const url = `/role/${id}`;
  return axiosCLient.put(url, data);
};

export const removeOne = (id: number): Promise<Response<null>> => {
  const url = `/role/${id}`;
  return axiosCLient.delete(url);
};
