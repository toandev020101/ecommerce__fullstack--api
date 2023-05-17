import { Request, Response } from 'express';
import { Like } from 'typeorm';
import { CommonResponse, ListParams } from '../interfaces/common';
import { toDate, toDateString } from '../utils/date';
import { CouponInput } from './../interfaces/CouponInput';
import { Coupon } from './../models/Coupon';

// get all
export const getAllPublic = async (_req: Request, res: Response<CommonResponse<Coupon>>) => {
  try {
    // find coupons
    const coupons = await Coupon.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả mã giảm giá thành công',
      data: coupons,
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

// get pagination
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Coupon>>) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find coupons
    const couponRes = await Coupon.findAndCount({
      where: searchTerm
        ? [
            { name: Like(`%${searchTerm.toLowerCase()}%`) },
            { priceMaxName: Like(`%${searchTerm.toLowerCase()}%`) },
            { code: Like(`%${searchTerm.toLowerCase()}%`) },
          ]
        : {},
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách mã giảm giá thành công',
      data: couponRes[0],
      pagination: {
        _limit,
        _page,
        _total: couponRes[1],
      },
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

// add coupon
export const checkOne = async (req: Request<{ code: string }, {}, {}, {}>, res: Response<CommonResponse<Coupon>>) => {
  const { code } = req.params;

  try {
    // check coupon
    const coupon = await Coupon.findOneBy({ code });

    if (!coupon) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Mã giảm giá không tồn tại',
      });
    }

    const currentDate = new Date();
    const currentDateString = toDateString(currentDate);
    if (toDate(toDateString(coupon.startDate)) > toDate(currentDateString)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã giảm giá chưa được triển khai',
      });
    }

    if (toDate(toDateString(coupon.endDate)) < toDate(currentDateString)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã giảm giá đã quá hạn',
      });
    }

    if (coupon.quantity === 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã giảm giá đã hết',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Áp dụng mã giảm giá thành công',
      data: coupon,
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

// add order
export const addOne = async (req: Request<{}, {}, CouponInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const userId = req.userId;

  try {
    // check code
    const coupon = await Coupon.findOneBy({ code: data.code });
    if (coupon) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã đã tồn tại',
        errors: [{ field: 'code', message: 'Mã đã tồn tại!' }],
      });
    }

    // add coupon
    await Coupon.insert({ ...data, userId });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm mã giảm giá thành công',
      data: null,
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

// update coupon
export const updateOne = async (
  req: Request<{ id: string }, {}, CouponInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const data = req.body;
  const userId = req.userId;
  const { id } = req.params;

  try {
    // check code
    let coupon = await Coupon.findOneBy({ id: parseInt(id) });
    if (!coupon) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Mã giảm giá không tồn tại',
      });
    }

    // check code
    coupon = await Coupon.findOneBy({ code: data.code });
    if (coupon && coupon.id !== parseInt(id)) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã đã tồn tại',
        errors: [{ field: 'code', message: 'Mã đã tồn tại!' }],
      });
    }

    // update coupon
    await Coupon.update(id, { ...data, userId });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật mã giảm giá thành công',
      data: null,
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

// delete any order
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check coupon
      const coupon = await Coupon.findOneBy({ id: ids[i] });

      if (!coupon) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Mã giảm giá không tồn tại',
        });
      }
    }

    // delete coupon
    await Coupon.delete(ids);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách mã giảm giá thành công',
      data: null,
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

// delete one order
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check coupon
    const coupon = await Coupon.findOneBy({ id });

    if (!coupon) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Mã giảm giá không tồn tại',
      });
    }

    // delete coupon
    await Coupon.delete(id);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa mã giảm giá thành công',
      data: null,
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
