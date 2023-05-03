import { Ward } from './../models/Ward';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';
import { Like } from 'typeorm';

// get list ward by districtId and search term
export const getListByDistrictIdAndSearchTerm = async (
  req: Request<{ districtId: number }, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<Ward>>,
) => {
  const { districtId } = req.params;
  const { searchTerm } = req.query;

  try {
    // find wards
    const wards = await Ward.find({
      where: searchTerm ? { districtId, name: Like(`%${searchTerm}%`) } : { districtId },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách phường, xã thành công',
      data: wards,
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
