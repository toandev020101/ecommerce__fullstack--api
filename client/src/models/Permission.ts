export interface Permission {
  id: number;
  name: string;
  slug: string;
  method: number;
  rolePermissions?: [
    {
      permissionId: number;
      role?: {
        id: number;
        name: string;
      };
    },
  ];
  createdAt: Date;
  updatedAt?: Date;
}
