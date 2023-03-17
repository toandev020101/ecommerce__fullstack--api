export interface User {
  id: number;
  fullName: string;
  username: string;
  avatar: string;
  gender: number;
  email: string;
  phoneNumber?: string;
  isActive: number;
  tokenVersion?: number;
  roleId?: number;
  createdAt?: string;
  updatedAt?: string;
  role?: {
    id: number;
    code?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
