import { Request, Response } from 'express';
import { IsNull, Like } from 'typeorm';
import { CommonResponse } from '../interfaces/common';
import { OrderLine } from './../models/OrderLine';

// get list orderLine by search term
export const getListBySearchTerm = async (
  req: Request<{}, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<OrderLine>>,
) => {
  const { searchTerm } = req.query;

  try {
    // find orderLines
    const orderLines = await OrderLine.find({
      where: searchTerm
        ? {
            productItem: { product: { name: Like(`%${searchTerm}%`) } },
            reviews: { id: IsNull() },
            order: { orderStatus: { name: 'Thành công' } },
          }
        : { reviews: { id: IsNull() }, order: { orderStatus: { name: 'Thành công' } } },
      relations: {
        productItem: {
          product: true,
        },
        reviews: true,
        order: { orderStatus: true },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách mục đơn hàng thành công',
      data: orderLines,
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
