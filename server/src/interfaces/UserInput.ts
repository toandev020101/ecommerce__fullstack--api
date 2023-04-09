export interface UserInput {
  fullName: string;
  username: string;
  password: string;
  gender: number;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  street?: string;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  isActive: number;
  roleId: number;
}
