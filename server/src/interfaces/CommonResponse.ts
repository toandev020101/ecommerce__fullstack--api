import { BaseResponse } from './BaseResponse';
export interface CommonResponse<T> extends BaseResponse {
  data?: T | T[];
}
