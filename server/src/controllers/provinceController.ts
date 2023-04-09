import { Province } from './../models/Province';
import { Request, Response } from 'express';
import { CommonResponse } from './../interfaces/common';

// get all province
export const getAll = async (_req: Request, res: Response<CommonResponse<Province>>) => {
  try {
    // find provinces
    const provinces = await Province.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả tỉnh, thành phố thành công',
      data: provinces,
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

// get one province by id
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Province>>) => {
  const { id } = req.params;

  try {
    // find province
    const province = await Province.findOneBy({ id });

    if (!province) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tỉnh, thành phố không tồn tại',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tỉnh, thành phố thành công',
      data: province,
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
