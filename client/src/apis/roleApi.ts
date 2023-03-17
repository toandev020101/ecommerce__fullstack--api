import { Response } from '../interfaces/common';
import { Role } from '../models/Role';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Role>> => {
  const url = '/role';
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<Role>> => {
  const url = `/role/${id}`;
  return axiosCLient.get(url);
};
