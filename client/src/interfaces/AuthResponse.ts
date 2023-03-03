import { BaseResponse } from './BaseResponse';
import { User } from './User';

export interface AuthResponse extends BaseResponse {
  data?: User;
  accessToken?: string;
}
