import { Response } from '../interfaces/common';
import { User } from '../interfaces/User';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<User>> => {
  const url = '/user';
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<User>> => {
  const url = `/user/${id}`;
  return axiosCLient.get(url);
};
