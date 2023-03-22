export interface UserInput {
  fullName: string;
  username: string;
  password: string;
  gender: number;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  isActive: number;
  roleId: number | string;
}
