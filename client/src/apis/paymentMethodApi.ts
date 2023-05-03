import { Response } from '../interfaces/common';
import { PaymentMethod } from '../models/PaymentMethod';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<PaymentMethod>> => {
  const url = '/payment-method';
  return axiosCLient.get(url);
};
