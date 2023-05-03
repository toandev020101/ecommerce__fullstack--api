import { Province } from './../models/Province';
import { Request, Response } from 'express';
import { CommonResponse } from './../interfaces/common';
import { Like } from 'typeorm';

// get list province by search term
export const getListBySearchTerm = async (
  req: Request<{}, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<Province>>,
) => {
  const { searchTerm } = req.query;

  try {
    // find provinces
    const provinces = await Province.findBy(searchTerm ? { name: Like(`%${searchTerm}%`) } : {});

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách tỉnh, thành phố thành công',
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

