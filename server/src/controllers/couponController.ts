import { toDate } from '../utils/date';
import { Coupon } from './../models/Coupon';
import { Inventory } from '../models/Inventory';
import { ProductItem } from '../models/ProductItem';
import { OrderStatus } from '../models/OrderStatus';
import { Request, Response } from 'express';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { CartItem } from '../models/CartItem';
import { Order } from '../models/Order';
import { OrderInput } from '../interfaces/OrderInput';
import { OrderCoupon } from '../models/OrderCoupon';
import { OrderLine } from '../models/OrderLine';

// get pagination
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Order>>) => {
  const { _limit, _page, _sort, _order } = req.query;

  try {
    // find orders
    const orderRes = await Order.findAndCount({
      select: {
        id: true,
        userId: true,
        fullName: true,
        phoneNumber: true,
        street: true,
        wardId: true,
        ward: {
          id: true,
          name: true,
        },
        districtId: true,
        district: {
          id: true,
          name: true,
        },
        provinceId: true,
        province: {
          id: true,
          name: true,
        },
        totalPrice: true,
        orderStatusId: true,
        orderStatus: {
          id: true,
          name: true,
        },
        paymentMethodId: true,
        paymentMethod: {
          id: true,
          name: true,
        },
      },
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        ward: true,
        district: true,
        province: true,
        paymentMethod: true,
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      data: orderRes[0],
      pagination: {
        _limit,
        _page,
        _total: orderRes[1],
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

// add order
export const checkOne = async (req: Request<{}, {}, {}, { code: string }>, res: Response<CommonResponse<Coupon>>) => {
  const { code } = req.query;

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
    if (toDate(coupon.startDate) > currentDate) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã giảm giá chưa được triển khai',
      });
    }

    if (toDate(coupon.endDate) < currentDate) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Mã giảm giá đã quá hạn',
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
export const addOne = async (req: Request<{}, {}, OrderInput, {}>, res: Response<CommonResponse<null>>) => {
  const { lines, coupons, ...others } = req.body;
  const userId = req.userId;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const orderStatus = await OrderStatus.findOneBy({ name: 'Chờ xác nhận' });
      if (!orderStatus) {
        return res.status(500).json({
          code: 500,
          success: false,
          message: `Lỗi server :: không tìm thấy trạng thái`,
        });
      }

      // add order
      const insertedOrder = await transactionalEntityManager.insert(Order, {
        ...others,
        userId,
        orderStatusId: orderStatus.id,
      });

      if (lines.length > 0) {
        // handle data
        let lineData = [];
        for (let i = 0; i < lines.length; i++) {
          lineData.push({
            orderId: insertedOrder.raw.insertId,
            variation: lines[i].variation,
            quantity: lines[i].quantity,
            price: lines[i].price,
            productItemId: lines[i].productItemId,
          });

          // delete cart item
          await transactionalEntityManager.delete(CartItem, { userId, productItemId: lines[i].productItemId });

          // desc quantity
          const productItem = await ProductItem.findOne({
            where: { id: lines[i].productItemId },
            relations: { inventory: true },
          });
          await transactionalEntityManager.update(Inventory, productItem?.inventoryId, {
            quantity: (productItem?.inventory?.quantity as number) - lines[i].quantity,
          });
        }

        // add order line
        await transactionalEntityManager.insert(OrderLine, lineData);
      }

      if (coupons && coupons.length > 0) {
        // handle data
        let couponData = [];
        for (let i = 0; i < coupons.length; i++) {
          couponData.push({
            orderId: insertedOrder.raw.insertId,
            code: coupons[i].code,
            price: coupons[i].price,
          });
        }

        // add order coupon
        await transactionalEntityManager.insert(OrderCoupon, couponData);
      }

      return null;
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm đơn hàng thành công',
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
      // check order
      const order = await Order.findOneBy({ id: ids[i] });

      if (!order) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Đơn hàng không tồn tại',
        });
      }
    }

    // delete order
    await Order.delete(ids);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách đơn hàng thành công',
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
    // check order
    const order = await Order.findOneBy({ id });

    if (!order) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    // delete order
    await CartItem.delete(id);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa đơn hàng thành công',
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
