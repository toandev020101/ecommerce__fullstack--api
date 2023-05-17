import { ShipMethodInput } from '../interfaces/ShipMethodInput';
import { ShipMethod } from './../models/ShipMethod';
import { Request, Response } from 'express';
import { CommonResponse, ListParams } from '../interfaces/common';
import { Like } from 'typeorm';

// get all ship method
export const getAll = async (_req: Request, res: Response<CommonResponse<ShipMethod>>) => {
  try {
    // find shipMethods
    const shipMethods = await ShipMethod.findBy({ deleted: 0 });

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

// get pagination
export const getPagination = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<ShipMethod>>,
) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find shipMethods
    const shipMethodRes = await ShipMethod.findAndCount({
      where: searchTerm ? [{ name: Like(`%${searchTerm.toLowerCase()}%`), deleted: 0 }] : { deleted: 0 },
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách phương thức giao hàng thành công',
      data: shipMethodRes[0],
      pagination: {
        _limit,
        _page,
        _total: shipMethodRes[1],
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

// add shipMethod
export const addOne = async (req: Request<{}, {}, ShipMethodInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;

  try {
    // add shipMethod
    await ShipMethod.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm phương thức giao hàng thành công',
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

// update shipMethod
export const updateOne = async (
  req: Request<{ id: string }, {}, ShipMethodInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const data = req.body;
  const { id } = req.params;

  try {
    // check shipMethod
    let shipMethod = await ShipMethod.findOneBy({ id: parseInt(id) });
    if (!shipMethod) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Phương thức giao hàng không tồn tại',
      });
    }

    // update shipMethod
    await ShipMethod.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật phương thức giao hàng thành công',
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

// delete any shipMethod
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check shipMethod
      const shipMethod = await ShipMethod.findOneBy({ id: ids[i] });

      if (!shipMethod) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Phương thức giao hàng không tồn tại',
        });
      }
    }

    // delete shipMethod
    await ShipMethod.update(ids, { deleted: 1 });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách phương thức giao hàng thành công',
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

// delete one shipMethod
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check shipMethod
    const shipMethod = await ShipMethod.findOneBy({ id });

    if (!shipMethod) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Phương thức giao hàng không tồn tại',
      });
    }

    // delete shipMethod
    await ShipMethod.update(id, { deleted: 1 });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa phương thức giao hàng thành công',
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
