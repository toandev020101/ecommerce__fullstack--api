import { FieldError } from './FieldError';

export interface BaseResponse {
  code: number;
  success: boolean;
  message?: string;
  errors?: FieldError[];
}
