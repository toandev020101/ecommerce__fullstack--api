import { Response } from '../interfaces/common';
import { OrderStatus } from '../models/OrderStatus';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<OrderStatus>> => {
  const url = '/order-status';
  return axiosCLient.get(url);
};
