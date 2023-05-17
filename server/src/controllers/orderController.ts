import { ReviewImage } from './../models/ReviewImage';
import { Review } from './../models/Review';
import { Coupon } from './../models/Coupon';
import { Inventory } from './../models/Inventory';
import { ProductItem } from './../models/ProductItem';
import { OrderStatus } from './../models/OrderStatus';
import { Request, Response } from 'express';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { CartItem } from '../models/CartItem';
import { Order } from '../models/Order';
import { OrderInput } from './../interfaces/OrderInput';
import { OrderCoupon } from './../models/OrderCoupon';
import { OrderLine } from './../models/OrderLine';
import { In, Like } from 'typeorm';

// get order by status id
export const getListByStatusId = async (
  req: Request<{ statusId: string }, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<Order>>,
) => {
  const { statusId } = req.params;
  const { searchTerm } = req.query;
  const userId = req.userId;

  let whereOptions: any[] = [{ userId }];

  const orderStatusId = parseInt(statusId);

  if (orderStatusId !== -1 && searchTerm) {
    whereOptions = [
      {
        orderStatusId,
        id: Like(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`),
        userId,
      },
      {
        orderStatusId,
        orderLines: {
          productItem: {
            product: {
              name: Like(`%${searchTerm.toLowerCase()}%`),
            },
          },
        },
        userId,
      },
    ];
  } else if (orderStatusId !== -1) {
    whereOptions = [{ orderStatusId, userId }];
  } else if (searchTerm) {
    whereOptions = [
      { id: Like(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`), userId },
      {
        orderLines: {
          productItem: {
            product: {
              name: Like(`%${searchTerm.toLowerCase()}%`),
            },
          },
        },
        userId,
      },
    ];
  }

  try {
    // find orders
    const orders = await Order.find({
      select: {
        id: true,
        userId: true,
        totalPrice: true,
        orderStatusId: true,
        orderStatus: {
          id: true,
          name: true,
        },
        orderLines: {
          id: true,
          variation: true,
          quantity: true,
          price: true,
          productItemId: true,
          productItem: {
            id: true,
            imageUrl: true,
            productId: true,
            product: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      where: whereOptions,
      order: { id: 'DESC' },
      relations: {
        orderStatus: true,
        orderLines: {
          productItem: {
            product: true,
          },
        },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      data: orders,
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
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Order>>) => {
  const { _limit, _page, _sort, _order, statusId, searchTerm } = req.query;

  try {
    let whereOptions: any[] = [];

    if (statusId && searchTerm) {
      whereOptions = [
        { orderStatusId: statusId, id: Like(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`) },
        { orderStatusId: statusId, fullName: Like(`%${searchTerm.toLowerCase()}%`) },
        { orderStatusId: statusId, phoneNumber: Like(`%${searchTerm.toLowerCase()}%`) },
      ];
    } else if (statusId) {
      whereOptions = [{ orderStatusId: statusId }];
    } else if (searchTerm) {
      whereOptions = [
        { id: Like(`%${searchTerm[0] === '#' ? searchTerm.split('#')[1] : searchTerm}%`) },
        { fullName: Like(`%${searchTerm.toLowerCase()}%`) },
        { phoneNumber: Like(`%${searchTerm.toLowerCase()}%`) },
      ];
    }

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
        totalQuantity: true,
        totalPrice: true,
        orderStatusId: true,
        orderStatus: {
          id: true,
          name: true,
        },
        orderLines: {
          id: true,
          variation: true,
          quantity: true,
          price: true,
          productItemId: true,
          productItem: {
            id: true,
            productId: true,
            product: {
              id: true,
              name: true,
            },
          },
        },
        orderCoupons: {
          id: true,
          code: true,
          price: true,
        },
        shipMethodId: true,
        shipMethod: {
          id: true,
          name: true,
          price: true,
        },
        paymentMethodId: true,
        paymentMethod: {
          id: true,
          name: true,
        },
        createdAt: true,
      },
      where: whereOptions,
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        ward: true,
        district: true,
        province: true,
        orderStatus: true,
        orderLines: {
          productItem: {
            product: true,
          },
        },
        orderCoupons: true,
        shipMethod: true,
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

// get one
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Order>>) => {
  const { id } = req.params;

  try {
    // find order
    const order = await Order.findOne({
      where: { id },
      relations: {
        ward: true,
        district: true,
        province: true,
        orderLines: { productItem: { product: true } },
        orderCoupons: true,
        orderStatus: true,
        shipMethod: true,
        paymentMethod: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đơn hàng không tồn tại',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy đơn hàng thành công',
      data: order,
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
      let orderStatusId = others.orderStatusId;
      if (!orderStatusId) {
        const orderStatus = await OrderStatus.findOneBy({ name: 'Chờ xử lý' });
        if (!orderStatus) {
          return res.status(500).json({
            code: 500,
            success: false,
            message: `Lỗi server :: không tìm thấy trạng thái`,
          });
        }

        orderStatusId = orderStatus.id;
      }

      // add order
      const insertedOrder = await transactionalEntityManager.insert(Order, {
        ...others,
        userId,
        orderStatusId,
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

          // find coupon
          const coupon = await Coupon.findOneBy({ code: coupons[i].code });

          // desc coupon
          await transactionalEntityManager.update(Coupon, coupon?.id, { quantity: (coupon?.quantity as number) - 1 });
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

// update order
export const updateOne = async (
  req: Request<{ id: number }, {}, OrderInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  // continue
  const { id } = req.params;
  const { lines, coupons, ...others } = req.body;
  const userId = req.userId;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // update order
      await transactionalEntityManager.update(Order, id, {
        ...others,
        userId,
      });

      if (lines.length > 0) {
        // get old order lines
        const oldOrderLines = await OrderLine.find({
          where: { orderId: id },
          relations: {
            productItem: {
              inventory: true,
            },
          },
        });

        // update quantity
        oldOrderLines.forEach(async (oldOrderLine) => {
          await transactionalEntityManager.update(Inventory, oldOrderLine.productItem.inventoryId, {
            quantity: (oldOrderLine.productItem.inventory.quantity as number) + oldOrderLine.quantity,
          });
        });

        const oldOrderLineIds = oldOrderLines.map((oldOrderLine) => oldOrderLine.id);
        const reviewRemoves = await Review.findBy({ orderLinedId: In(oldOrderLineIds) });
        const reviewRemoveIds = reviewRemoves.map((reviewRemove) => reviewRemove.id);

        // delete old reply
        await transactionalEntityManager.delete(Review, { reviewId: In(reviewRemoveIds) });

        // delete old review image
        await transactionalEntityManager.delete(ReviewImage, { reviewId: In(reviewRemoveIds) });

        // delete old review
        await transactionalEntityManager.delete(Review, { id: In(reviewRemoveIds) });

        // delete old order line
        await transactionalEntityManager.delete(OrderLine, { orderId: id });

        // handle data
        let lineData = [];
        for (let i = 0; i < lines.length; i++) {
          lineData.push({
            orderId: id,
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
        // delete old order coupon
        await transactionalEntityManager.delete(OrderCoupon, { orderId: id });

        // handle data
        let couponData = [];
        for (let i = 0; i < coupons.length; i++) {
          couponData.push({
            orderId: id,
            code: coupons[i].code,
            price: coupons[i].price,
          });

          // find coupon
          const coupon = await Coupon.findOneBy({ code: coupons[i].code });

          // desc coupon
          await transactionalEntityManager.update(Coupon, coupon?.id, { quantity: (coupon?.quantity as number) - 1 });
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
      message: 'Cập nhật đơn hàng thành công',
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

// change status
export const changeStatus = async (
  req: Request<{ id: number }, {}, { orderStatusId: number }, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { orderStatusId } = req.body;

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

    // update status order
    await Order.update(id, { orderStatusId });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật đơn hàng thành công',
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

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // get old order lines
      const oldOrderLines = await OrderLine.findBy({ orderId: In(ids) });

      const oldOrderLineIds = oldOrderLines.map((oldOrderLine) => oldOrderLine.id);
      const reviewRemoves = await Review.findBy({ orderLinedId: In(oldOrderLineIds) });
      const reviewRemoveIds = reviewRemoves.map((reviewRemove) => reviewRemove.id);

      // delete old reply
      await transactionalEntityManager.delete(Review, { reviewId: In(reviewRemoveIds) });

      // delete old review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: In(reviewRemoveIds) });

      // delete old review
      await transactionalEntityManager.delete(Review, { id: In(reviewRemoveIds) });

      // delete order line
      await transactionalEntityManager.delete(OrderLine, { orderId: In(ids) });
      // delete order coupon
      await transactionalEntityManager.delete(OrderCoupon, { orderId: In(ids) });
      // delete order
      await transactionalEntityManager.delete(Order, { id: In(ids) });
    });

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

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // get old order lines
      const oldOrderLines = await OrderLine.findBy({ orderId: id });

      const oldOrderLineIds = oldOrderLines.map((oldOrderLine) => oldOrderLine.id);
      const reviewRemoves = await Review.findBy({ orderLinedId: In(oldOrderLineIds) });
      const reviewRemoveIds = reviewRemoves.map((reviewRemove) => reviewRemove.id);

      // delete old reply
      await transactionalEntityManager.delete(Review, { reviewId: In(reviewRemoveIds) });

      // delete old review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: In(reviewRemoveIds) });

      // delete old review
      await transactionalEntityManager.delete(Review, { id: In(reviewRemoveIds) });

      // delete order line
      await transactionalEntityManager.delete(OrderLine, { orderId: id });
      // delete order coupon
      await transactionalEntityManager.delete(OrderCoupon, { orderId: id });
      // delete order
      await transactionalEntityManager.delete(Order, { id });
    });

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
