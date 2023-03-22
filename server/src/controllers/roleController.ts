import { Request, Response } from 'express';
import AppDataSource from '../AppDataSource';
import { RolePermissionInput } from '../interfaces/RolePermissionInput';
import { RolePermission } from '../models/RolePermission';
import { CommonResponse } from './../interfaces/common';
import { Role } from './../models/Role';
import { User } from './../models/User';

// get all role
export const getAll = async (_req: Request, res: Response<CommonResponse<Role>>) => {
  try {
    // find roles
    const roles = await Role.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả vai trò thành công',
      data: roles,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};

// get all role and user
export const getAllAndUser = async (_req: Request, res: Response<CommonResponse<Role>>) => {
  try {
    // find permissions
    const roles = await Role.find({
      select: {
        id: true,
        name: true,
        users: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      relations: {
        users: true,
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả vai trò thành công',
      data: roles,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};

// get one role and permission
export const getOneAndPermissionById = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<Role>>,
) => {
  const { id } = req.params;
  try {
    // find role
    const role = await Role.findOne({
      where: { id },
      relations: {
        rolePermissions: true,
      },
    });

    if (!role) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Vai trò không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy vai trò thành công',
      data: role,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};

// add one role
export const addOne = async (req: Request<{}, {}, RolePermissionInput, {}>, res: Response<CommonResponse<null>>) => {
  const { name, permissionIds } = req.body;

  if (name === '') {
    return res.status(400).json({
      code: 400,
      success: false,
      message: 'Thêm mới thất bại',
      errors: [{ field: 'name', message: 'Tên vai trò không thể để trống!' }],
    });
  }

  try {
    // check role
    const role = await Role.findOneBy({ name });

    if (role) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Thêm mới vai trò thất bại',
        errors: [{ field: 'name', message: 'Tên vai trò đã tồn tại!' }],
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // add role
      const insertedRole = await transactionalEntityManager.insert(Role, { name });

      // handle data
      let rolePermissionData = [];
      for (let i = 0; i < permissionIds.length; i++) {
        rolePermissionData.push({
          roleId: insertedRole.raw.insertId,
          permissionId: permissionIds[i],
        });
      }

      // add role permission
      await transactionalEntityManager.insert(RolePermission, rolePermissionData);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm mới vai trò thành công',
      data: null,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};

// update one role
export const updateOne = async (
  req: Request<{ id: number }, {}, RolePermissionInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { name, permissionIds } = req.body;

  if (name === '') {
    return res.status(400).json({
      code: 400,
      success: false,
      message: 'Cập nhật vai trò thất bại',
      errors: [{ field: 'name', message: 'Tên vai trò không thể để trống!' }],
    });
  }

  try {
    // check role
    let role = await Role.findOneBy({ id });

    if (!role) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Vai trò không tồn tại!',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // update role
      await transactionalEntityManager.update(Role, id, { name });

      // handle data
      let rolePermissionData = [];
      for (let i = 0; i < permissionIds.length; i++) {
        rolePermissionData.push({
          roleId: id,
          permissionId: permissionIds[i],
        });
      }

      // delete role permission old
      await transactionalEntityManager.delete(RolePermission, { roleId: id });

      // add role permission new
      await transactionalEntityManager.insert(RolePermission, rolePermissionData);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật vai trò thành công',
      data: null,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};

// delete one role
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check role
    const role = await Role.findOneBy({ id });

    if (!role) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Vai trò không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete user
      await transactionalEntityManager.delete(User, { roleId: id });

      // delete role permission
      await transactionalEntityManager.delete(RolePermission, { roleId: id });

      // delete role
      await transactionalEntityManager.delete(Role, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa vai trò thành công',
      data: null,
    });
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};
