import axios, { AxiosResponse } from 'axios';
import JWTManager from '../utils/jwt';

const axiosCLient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  headers: {
    'content-type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
axiosCLient.interceptors.request.use(
  function (config: any) {
    // Do something before request is sent
    // send token
    const token = JWTManager.getToken() as string;

    config.headers = {
      authorization: `Bearer ${token ? token : ''}`,
    } as any;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosCLient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axiosCLient;
