import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from './../interfaces/BaseResponse';
import { User } from './../models/User';

export const checkPermission =
  (slug: string, method: 'get' | 'post' | 'put' | 'patch' | 'delete') =>
  async (req: Request<any, any, any, any>, res: Response<BaseResponse>, next: NextFunction) => {
    try {
      const methods = {
        get: 0,
        post: 1,
        put: 2,
        patch: 3,
        delete: 4,
      };

      const { userId } = req;
      const methodRoute = methods[method];

      const user = await User.findOne({
        select: {
          id: true,
          role: {
            id: true,
            rolePermissions: {
              id: true,
              roleId: true,
              permissionId: true,
              permission: {
                id: true,
                slug: true,
                method: true,
              },
            },
          },
        },
        where: { id: userId },
        relations: {
          role: { rolePermissions: { permission: true } },
        },
      });

      const permissionIndex = user?.role.rolePermissions.findIndex(
        (rolePermission) => rolePermission.permission.slug === slug && rolePermission.permission.method === methodRoute,
      );

      if (permissionIndex === -1) {
        // send error
        return res.status(403).json({
          code: 403,
          success: false,
          message: 'Bạn không có quyền thực hiện hành động này',
        });
      }

      return next();
    } catch (error: any) {
      // send error
      return res.status(500).json({
        code: 500,
        success: false,
        message: `Lỗi server :: ${error.message}`,
      });
    }
  };
