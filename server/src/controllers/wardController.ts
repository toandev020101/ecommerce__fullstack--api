import { Ward } from './../models/Ward';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';

// get list ward by districtId
export const getListByDistrictId = async (
  req: Request<{ districtId: number }, {}, {}, {}>,
  res: Response<CommonResponse<Ward>>,
) => {
  const { districtId } = req.params;

  try {
    // find wards
    const wards = await Ward.find({ where: { districtId } });

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

// get one ward by id
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Ward>>) => {
  const { id } = req.params;

  try {
    // find ward
    const ward = await Ward.findOneBy({ id });

    if (!ward) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Phường, xã không tồn tại',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy phường, xã thành công',
      data: ward,
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
