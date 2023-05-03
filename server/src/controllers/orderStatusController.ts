import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';
import { OrderStatus } from './../models/OrderStatus';

// get all order status
export const getAll = async (_req: Request, res: Response<CommonResponse<OrderStatus>>) => {
  try {
    // find orderStatusArr
    const orderStatusArr = await OrderStatus.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả trạng thái đơn hàng thành công',
      data: orderStatusArr,
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
