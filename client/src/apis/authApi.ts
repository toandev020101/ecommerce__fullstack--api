import { AuthResponse } from '../interfaces/AuthResponse';
import { LoginInput } from '../interfaces/LoginInput';
import { RegisterInput } from '../interfaces/RegisterInput';
import axiosCLient from './axiosClient';

export const register = (data: RegisterInput): Promise<AuthResponse> => {
  const url = '/auth/register';
  return axiosCLient.post(url, data);
};

export const login = (data: LoginInput): Promise<AuthResponse> => {
  const url = '/auth/login';
  return axiosCLient.post(url, data);
};

export const refreshToken = (): Promise<AuthResponse> => {
  const url = '/auth/refresh-token';
  return axiosCLient.get(url);
};
