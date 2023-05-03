import { Response } from '../interfaces/common';
import { Ward } from '../models/Ward';
import axiosCLient from './axiosClient';

export const getListByDistrictIdAndSearchTerm = (districtId: number, searchTerm: string): Promise<Response<Ward>> => {
  const url = `/ward/${districtId}/search`;
  return axiosCLient.get(url, { data: { searchTerm } });
};
