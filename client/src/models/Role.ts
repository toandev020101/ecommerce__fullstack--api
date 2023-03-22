export interface Role {
  id: number;
  name: string;
  users?: [
    {
      id: number;
      username: string;
      avatar: string;
    },
  ];
  rolePermissions?: [
    {
      id: number;
      roleId: number;
      permissionId: number;
    },
  ];
  createdAt?: string;
  updatedAt?: string;
}
