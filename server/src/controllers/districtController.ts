import { District } from './../models/District';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';

// get list district by provinceId
export const getListByProvinceId = async (
  req: Request<{ provinceId: number }, {}, {}, {}>,
  res: Response<CommonResponse<District>>,
) => {
  const { provinceId } = req.params;

  try {
    // find districts
    const districts = await District.find({ where: { provinceId } });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách quận, huyện thành công',
      data: districts,
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

// get one district by id
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<District>>) => {
  const { id } = req.params;

  try {
    // find district
    const district = await District.findOneBy({ id });

    if (!district) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Quận, huyện không tồn tại',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy quận, huyện thành công',
      data: district,
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
