import { Response } from '../interfaces/common';
import { Province } from '../models/Province';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<Province>> => {
  const url = '/province';
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<Province>> => {
  const url = `/province/${id}`;
  return axiosCLient.get(url);
};
