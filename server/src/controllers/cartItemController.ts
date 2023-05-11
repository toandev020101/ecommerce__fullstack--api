import { Request, Response } from 'express';
import AppDataSource from '../AppDataSource';
import { CommonResponse } from '../interfaces/common';
import { CartItemInput } from './../interfaces/CartItemInput';
import { CartItem } from './../models/CartItem';
import { ProductItem } from './../models/ProductItem';

// get all
export const getAll = async (req: Request, res: Response<CommonResponse<CartItem>>) => {
  const userId = req.userId;

  try {
    // find cartItems
    const cartItems = await CartItem.find({
      select: {
        id: true,
        quantity: true,
        productItemId: true,
        userId: true,
        productItem: {
          id: true,
          SKU: true,
          imageUrl: true,
          productId: true,
          inventoryId: true,
          price: true,
          discount: true,
          discountStartDate: true,
          discountEndDate: true,
          product: {
            id: true,
            name: true,
            slug: true,
            category: {
              id: true,
              slug: true,
            },
            productItems: {
              id: true,
              SKU: true,
              imageUrl: true,
              productId: true,
              inventoryId: true,
              price: true,
              discount: true,
              discountStartDate: true,
              discountEndDate: true,
              inventory: {
                id: true,
                quantity: true,
              },
              productConfigurations: {
                id: true,
                variationOption: {
                  id: true,
                  value: true,
                  slug: true,
                  variationId: true,
                  variation: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          inventory: {
            id: true,
            quantity: true,
          },
          productConfigurations: {
            id: true,
            variationOption: {
              id: true,
              value: true,
              slug: true,
              variationId: true,
              variation: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      where: { userId },
      order: { id: 'DESC' },
      relations: {
        productItem: {
          product: {
            category: true,
            productItems: {
              inventory: true,
              productConfigurations: {
                variationOption: { variation: true },
              },
            },
          },
          inventory: true,
          productConfigurations: {
            variationOption: { variation: true },
          },
        },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả sản phẩm thành công',
      data: cartItems,
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

// add cartItem
export const addAny = async (req: Request<{}, {}, CartItemInput[], {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const userId = req.userId;

  try {
    data.forEach(async (item) => {
      const { quantity, productItemId } = item;

      // check cartItem
      const cartItem = await CartItem.findOneBy({ userId, productItemId });

      if (cartItem) {
        await CartItem.update({ userId, productItemId }, { quantity: quantity + cartItem.quantity });
      } else {
        await CartItem.insert({ ...item, userId });
      }
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm danh sách sản phẩm thành công',
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

// add cartItem
export const addOne = async (req: Request<{}, {}, CartItemInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { quantity, productItemId } = data;
  const userId = req.userId;

  try {
    // check cartItem
    const cartItem = await CartItem.findOneBy({ userId, productItemId });

    if (cartItem) {
      await CartItem.update({ userId, productItemId }, { quantity: quantity + cartItem.quantity });
    } else {
      await CartItem.insert({ ...data, userId });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
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

// update product item cart item
export const changeProductItem = async (
  req: Request<{ id: number }, {}, CartItemInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { productItemId } = req.body;
  const userId = req.userId;

  try {
    // check cart item
    const cartItem = await CartItem.findOneBy({ id });

    if (!cartItem) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    let data = { quantity: cartItem.quantity, productItemId };
    const productItem = await ProductItem.findOneBy({ id: productItemId });

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // check product item id
      const cartItemCheck = await CartItem.findOneBy({ productItemId, userId });

      if (cartItemCheck) {
        data.quantity += cartItemCheck.quantity;
      }

      // check quantity
      if ((productItem?.inventory?.quantity as number) < data.quantity) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: 'Cập nhật sản phẩm thất bại',
        });
      }

      if (cartItemCheck) {
        // delete cart item
        await transactionalEntityManager.delete(CartItem, cartItemCheck.id);
      }

      // update cart item
      await transactionalEntityManager.update(CartItem, id, data);

      return null;
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật sản phẩm thành công',
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

// update quantity cart item
export const changeQuantity = async (
  req: Request<{ id: number }, {}, CartItemInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check cart item
    const cartItem = await CartItem.findOneBy({ id });

    if (!cartItem) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    // update cart item
    await CartItem.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật sản phẩm thành công',
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

// delete any cart item
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check cart item
      const cartItem = await CartItem.findOneBy({ id: ids[i] });

      if (!cartItem) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Sản phẩm không tồn tại',
        });
      }
    }

    // delete cart item
    await CartItem.delete(ids);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách sản phẩm thành công',
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

// delete one cart item
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check cart item
    const cartItem = await CartItem.findOneBy({ id });

    if (!cartItem) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    // delete cart item
    await CartItem.delete(id);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa sản phẩm thành công',
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
