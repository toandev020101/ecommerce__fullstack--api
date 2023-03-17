import { BaseResponse } from './BaseResponse';
import { User } from '../models/User';

export interface AuthResponse extends BaseResponse {
  data?: User;
  accessToken?: string;
}
