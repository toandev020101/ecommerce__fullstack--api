import { Response } from '../interfaces/common';
import { OrderLine } from '../models/Order';
import axiosCLient from './axiosClient';

export const getListBySearchTerm = (searchTerm: string): Promise<Response<OrderLine>> => {
  const url = '/order-line/search';
  return axiosCLient.get(url, { params: { searchTerm } });
};
