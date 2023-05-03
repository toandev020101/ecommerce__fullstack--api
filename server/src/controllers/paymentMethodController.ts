import { PaymentMethod } from './../models/PaymentMethod';
import { Request, Response } from 'express';
import { CommonResponse } from '../interfaces/common';

// get all payment method
export const getAll = async (_req: Request, res: Response<CommonResponse<PaymentMethod>>) => {
  try {
    // find paymentMethods
    const paymentMethods = await PaymentMethod.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả phương thức thanh toán thành công',
      data: paymentMethods,
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
