import { Response } from '../interfaces/common';
import { Province } from '../models/Province';
import axiosCLient from './axiosClient';



export const getListBySearchTerm = (searchTerm: string): Promise<Response<Province>> => {
  const url = '/province/search';
  return axiosCLient.get(url, { data: { searchTerm } });
};

