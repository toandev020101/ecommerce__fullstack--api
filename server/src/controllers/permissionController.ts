import { In, Like } from 'typeorm';
import { RolePermission } from './../models/RolePermission';
import { Request, Response } from 'express';
import { Permission } from '../models/Permission';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { PermissionInput } from '../interfaces/PermissionInput';
import { Role } from '../models/Role';

// get all permissions
export const getAll = async (_req: Request, res: Response<CommonResponse<Permission>>) => {
  try {
    // find permissions
    const permissions = await Permission.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả quyền thành công',
      data: permissions,
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

// get pagination permission and role
export const getPaginationAndRole = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<Permission>>,
) => {
  const { _limit, _page, _sort, _order, method, searchTerm } = req.query;

  try {
    // find permissions
    const permissionRes = await Permission.findAndCount({
      select: {
        id: true,
        name: true,
        slug: true,
        method: true,
        createdAt: true,
        rolePermissions: {
          id: true,
          roleId: true,
          permissionId: true,
          role: {
            id: true,
            name: true,
          },
        },
      },
      where: method
        ? [
            { method, name: Like(`%${searchTerm.toLowerCase()}%`) },
            { method, slug: Like(`%${searchTerm.toLowerCase()}%`) },
          ]
        : [{ name: Like(`%${searchTerm.toLowerCase()}%`) }, { slug: Like(`%${searchTerm.toLowerCase()}%`) }],
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        rolePermissions: { role: true },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách quyền thành công',
      data: permissionRes[0],
      pagination: {
        _limit,
        _page,
        _total: permissionRes[1],
      },
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

// add permission
export const addOne = async (req: Request<{}, {}, PermissionInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { slug, method } = data;

  try {
    // check permission
    const permission = await Permission.findOneBy({ slug, method });
    if (permission) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Quyền đã tồn tại',
        errors: [
          { field: 'slug', message: 'Quyền đã tồn tại' },
          { field: 'method', message: 'Quyền đã tồn tại' },
        ],
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // add permission
      const insertedPermission = await transactionalEntityManager.insert(Permission, data);

      // get role admin
      const role = await transactionalEntityManager.findOneBy(Role, { name: 'Quản trị viên' });

      // add role permission
      await transactionalEntityManager.insert(RolePermission, {
        roleId: role?.id,
        permissionId: insertedPermission.raw.insertId,
      });
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm quyền thành công',
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

// update one permission
export const updateOne = async (
  req: Request<{ id: number }, {}, PermissionInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check permission
    const permission = await Permission.findOneBy({ id });

    if (!permission) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Quyền không tồn tại',
      });
    }

    // update permission
    await Permission.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật quyền thành công',
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

// delete any permission
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check permission
      const permission = await Permission.findOneBy({ id: ids[i] });

      if (!permission) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Quyền không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete role permission
      await transactionalEntityManager.delete(RolePermission, { permissionId: In(ids) });

      // add permission
      await transactionalEntityManager.delete(Permission, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách quyền thành công',
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

// delete one permission
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check permission
    const permission = await Permission.findOneBy({ id });

    if (!permission) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Quyền không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete role permission
      await transactionalEntityManager.delete(RolePermission, { permissionId: id });

      // add permission
      await transactionalEntityManager.delete(Permission, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa quyền thành công',
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
