import { User } from '../models/User';
import { BaseResponse } from './BaseResponse';

export interface AuthResponse extends BaseResponse {
  data?: User;
  accessToken?: string;
}
