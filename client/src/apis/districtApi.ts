import { Response } from '../interfaces/common';
import { District } from '../models/District';
import axiosCLient from './axiosClient';

export const getListByProvinceId = (provinceId: number): Promise<Response<District>> => {
  const url = `/district/any/${provinceId}`;
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<District>> => {
  const url = `/district/${id}`;
  return axiosCLient.get(url);
};
