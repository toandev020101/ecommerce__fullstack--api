import { Response } from '../interfaces/common';
import { Ward } from '../models/Ward';
import axiosCLient from './axiosClient';

export const getListByDistrictId = (districtId: number): Promise<Response<Ward>> => {
  const url = `/ward/any/${districtId}`;
  return axiosCLient.get(url);
};

export const getOneById = (id: number): Promise<Response<Ward>> => {
  const url = `/ward/${id}`;
  return axiosCLient.get(url);
};
