import { ListParams, Response } from '../interfaces/common';
import { Media } from '../models/Media';
import axiosCLient from './axiosClient';

export const getPaginationAndUser = (params: ListParams): Promise<Response<Media>> => {
  const url = '/media/pagination/user';
  return axiosCLient.get(url, { params });
};

export const getAllDate = (): Promise<Response<Date>> => {
  const url = '/media/date';
  return axiosCLient.get(url);
};

export const addAny = (formData: FormData): Promise<Response<null>> => {
  const url = '/media/any';
  return axiosCLient.post(url, formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const addOne = (formData: FormData): Promise<Response<string>> => {
  const url = '/media';
  return axiosCLient.post(url, formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const removeAny = (ids: number[]): Promise<Response<null>> => {
  const url = `/media`;
  return axiosCLient.delete(url, { data: { ids } });
};
