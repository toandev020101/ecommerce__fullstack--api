import { Response } from '../interfaces/common';
import { District } from '../models/District';
import axiosCLient from './axiosClient';

export const getListByProvinceIdAndSearchTerm = (
  provinceId: number,
  searchTerm: string,
): Promise<Response<District>> => {
  const url = `/district/${provinceId}/search`;
  return axiosCLient.get(url, { data: { searchTerm } });
};
