export interface UserInput {
  fullName: string;
  username: string;
  password: string;
  gender: number;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  street?: string;
  provinceId?: number | string;
  districtId?: number | string;
  wardId?: number | string;
  isActive: number;
  roleId: number | string;
}
