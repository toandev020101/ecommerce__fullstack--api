import { Role } from './../models/Role';
import { CommonResponse } from './../interfaces/common';
import { Request, Response } from 'express';

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

// get one role
export const getOneById = async (req: Request<{}, {}, { id: number }, {}>, res: Response<CommonResponse<Role>>) => {
  try {
    // find Role
    const role = await Role.findOneBy({ id: req.body.id });

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
