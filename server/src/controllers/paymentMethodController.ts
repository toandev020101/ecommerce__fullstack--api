import { PaymentMethod } from './../models/PaymentMethod';
import { Request, Response } from 'express';
import { CommonResponse, ListParams } from '../interfaces/common';
import { Like } from 'typeorm';
import { PaymentMethodInput } from '../interfaces/PaymentMethodInput';

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

// get pagination
export const getPagination = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<PaymentMethod>>,
) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find paymentMethods
    const paymentMethodRes = await PaymentMethod.findAndCount({
      where: searchTerm ? [{ name: Like(`%${searchTerm}%`), deleted: 0 }] : { deleted: 0 },
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách phương thức thanh toán thành công',
      data: paymentMethodRes[0],
      pagination: {
        _limit,
        _page,
        _total: paymentMethodRes[1],
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

// add PaymentMethod
export const addOne = async (req: Request<{}, {}, PaymentMethodInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;

  try {
    // add paymentMethod
    await PaymentMethod.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm phương thức thanh toán thành công',
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

// update paymentMethod
export const updateOne = async (
  req: Request<{ id: string }, {}, PaymentMethodInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const data = req.body;
  const { id } = req.params;

  try {
    // check paymentMethod
    let paymentMethod = await PaymentMethod.findOneBy({ id: parseInt(id) });
    if (!paymentMethod) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Phương thức thanh toán không tồn tại',
      });
    }

    // update paymentMethod
    await PaymentMethod.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật phương thức thanh toán thành công',
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

// delete any paymentMethod
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check paymentMethod
      const paymentMethod = await PaymentMethod.findOneBy({ id: ids[i] });

      if (!paymentMethod) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Phương thức thanh toán không tồn tại',
        });
      }
    }

    // delete paymentMethod
    await PaymentMethod.update(ids, { deleted: 1 });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách phương thức thanh toán thành công',
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

// delete one paymentMethod
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check paymentMethod
    const paymentMethod = await PaymentMethod.findOneBy({ id });

    if (!paymentMethod) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Phương thức thanh toán không tồn tại',
      });
    }

    // delete paymentMethod
    await PaymentMethod.update(id, { deleted: 1 });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa phương thức thanh toán thành công',
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
