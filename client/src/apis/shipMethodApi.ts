import { Response } from '../interfaces/common';
import { ShipMethod } from '../models/ShipMethod';
import axiosCLient from './axiosClient';

export const getAll = (): Promise<Response<ShipMethod>> => {
  const url = '/ship-method';
  return axiosCLient.get(url);
};
