import { ShipMethod } from './../models/ShipMethod';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';

// get all ship method
export const getAll = async (_req: Request, res: Response<CommonResponse<ShipMethod>>) => {
  try {
    // find shipMethods
    const shipMethods = await ShipMethod.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả phương thức giao hàng thành công',
      data: shipMethods,
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
