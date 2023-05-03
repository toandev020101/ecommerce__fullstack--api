import { District } from './../models/District';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';
import { Like } from 'typeorm';

// get list district by provinceId and search term
export const getListByProvinceIdAndSearchTerm = async (
  req: Request<{ provinceId: number }, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<District>>,
) => {
  const { provinceId } = req.params;
  const { searchTerm } = req.query;

  try {
    // find districts
    const districts = await District.find({
      where: searchTerm ? { provinceId, name: Like(`%${searchTerm}%`) } : { provinceId },
    });

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
