import { Request, Response } from 'express';
import { In, Like } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { Inventory } from '../models/Inventory';
import { ProductConfiguration } from '../models/ProductConfiguration';
import { ProductConnect } from '../models/ProductConnect';
import { ProductImage } from '../models/ProductImage';
import { ProductItem } from '../models/ProductItem';
import { ProductTag } from '../models/ProductTag';
import { ProductInput } from './../interfaces/ProductInput';
import { Product } from './../models/Product';
import { Category } from '../models/Category';
import { Tag } from '../models/Tag';

// get all products
export const getAll = async (_req: Request, res: Response<CommonResponse<Product>>) => {
  try {
    // find products
    const products = await Product.find({
      where: { deleted: 0 },
      relations: {
        category: true,
        productItems: {
          inventory: true,
          productImages: true,
        },
        productTags: { tag: true },
        productConnects: true,
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả sản phẩm thành công',
      data: products,
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

// get list products
export const getListBySearchTerm = async (
  req: Request<{}, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<Product>>,
) => {
  const { searchTerm } = req.query;

  try {
    // find products
    const products = await Product.findBy({ name: Like(`%${searchTerm}%`), deleted: 0 });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: products,
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

// get pagination product
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Product>>) => {
  const { _limit, _page, _sort, _order, categoryId, inventoryStatus, isActive, searchTerm } = req.query;

  try {
    let whereOptions: any = [
      { name: Like(`%${searchTerm}%`), deleted: 0 },
      { slug: Like(`%${searchTerm}%`), deleted: 0 },
    ];

    if (categoryId && categoryId !== '') {
      whereOptions = whereOptions.map((option: any) => ({ ...option, categoryId }));
    }

    if (isActive && isActive !== '') {
      whereOptions = whereOptions.map((option: any) => ({ ...option, isActive }));
    }

    // find products
    const productRes = await Product.findAndCount({
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        isActive: true,
        category: {
          id: true,
          name: true,
          slug: true,
        },
        productTags: {
          id: true,
          productId: true,
          tagId: true,
          tag: {
            id: true,
            name: true,
          },
        },
        productItems: {
          id: true,
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
        },
      },
      where: whereOptions,
      skip: _page * _limit,
      take: _limit,
      order: _sort === 'price' ? {} : { [_sort]: _order },
      relations: {
        category: true,
        productTags: { tag: true },
        productItems: {
          inventory: true,
        },
      },
    });

    // filter by inventory status
    let data: any[] = productRes[0];
    if (inventoryStatus && inventoryStatus !== '') {
      data = productRes[0].map((product) => {
        let quantityTotal = 0;
        product.productItems.forEach((productItem) => {
          quantityTotal += productItem.inventory.quantity;
        });

        if (
          (parseInt(inventoryStatus) === 1 && quantityTotal > 0) ||
          (parseInt(inventoryStatus) === 0 && quantityTotal === 0)
        )
          return product;
        return null;
      });
      data = data.filter((dataItem) => dataItem !== null);
    }

    // sort by price
    if (_sort === 'price') {
      data.sort(
        (data1, data2) =>
          (_order === 'asc' ? data1 : data2).productItems.sort(
            (productItem1: any, productItem2: any) =>
              (_order === 'asc' ? productItem1 : productItem2).price -
              (_order === 'asc' ? productItem2 : productItem1).price,
          )[0].price -
          (_order === 'asc' ? data2 : data1).productItems.sort(
            (productItem1: any, productItem2: any) =>
              (_order === 'asc' ? productItem1 : productItem2).price -
              (_order === 'asc' ? productItem2 : productItem1).price,
          )[0].price,
      );
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data,
      pagination: {
        _limit,
        _page,
        _total: productRes[1],
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

// get one product
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Product>>) => {
  const { id } = req.params;
  try {
    // find product
    const product = await Product.findOne({
      where: { id, deleted: 0 },
      relations: {
        category: true,
        productTags: { tag: true },
        productItems: {
          inventory: true,
          productConfigurations: {
            variationOption: true,
          },
          productImages: true,
        },
        productConnects: { connect: true },
      },
    });

    if (!product) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy sản phẩm thành công',
      data: product,
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

// add any user
export const addAny = async (req: Request<{}, {}, ProductInput[], {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      for (let i = 0; i < data.length; i++) {
        const { items, connectIds, tagIds, ...others } = data[i];
        const { slug, categoryId } = others;

        const category = await Category.findOneBy({ id: categoryId });
        if (!category) {
          return res.status(400).json({
            code: 400,
            success: false,
            message: 'Thêm danh sách sản phẩm thất bại!',
          });
        }

        // check product
        const product = await Product.findOneBy({ slug });
        if (product) {
          // send results
          return res.status(400).json({
            code: 400,
            success: false,
            message: 'Sản phẩm đã tồn tại',
            errors: [{ field: 'slug', message: 'Sản phẩm đã tồn tại' }],
          });
        }

        // add product
        const insertedProduct = await transactionalEntityManager.insert(Product, others);

        if (connectIds.length > 0) {
          // handle data
          let productConnectData = [];
          for (let i = 0; i < connectIds.length; i++) {
            const product = await Product.findOneBy({ id: connectIds[i] });
            if (!product) {
              return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thêm danh sách sản phẩm thất bại!',
              });
            }

            productConnectData.push({
              productId: insertedProduct.raw.insertId,
              connectId: connectIds[i],
            });
          }

          // add product connect
          await transactionalEntityManager.insert(ProductConnect, productConnectData);
        }

        if (tagIds.length > 0) {
          // handle data
          let tagData = [];
          for (let i = 0; i < tagIds.length; i++) {
            const tag = await Tag.findOneBy({ id: tagIds[i] });
            if (!tag) {
              return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thêm danh sách sản phẩm thất bại!',
              });
            }

            tagData.push({
              productId: insertedProduct.raw.insertId,
              tagId: tagIds[i],
            });
          }

          // add product tag
          await transactionalEntityManager.insert(ProductTag, tagData);
        }

        for (let i = 0; i < items.length; i++) {
          const { idx, library, inventory, ...itemOthers } = items[i];

          // add inventory
          const insertedInventory = await transactionalEntityManager.insert(Inventory, inventory);

          // add product item
          const insertedProductItem = await transactionalEntityManager.insert(ProductItem, {
            ...itemOthers,
            productId: insertedProduct.raw.insertId,
            inventoryId: insertedInventory.raw.insertId,
          });

          // handle data
          const variationOptionIds = idx.split('-');
          let productConfigurationData = [];

          for (let j = 0; j < variationOptionIds.length; j++) {
            productConfigurationData.push({
              productItemId: insertedProductItem.raw.insertId,
              variationOptionId: parseInt(variationOptionIds[j]),
            });
          }

          // add product configuration
          await transactionalEntityManager.insert(ProductConfiguration, productConfigurationData);

          // handle data
          let productImageData = [];
          for (let j = 0; j < library.length; j++) {
            productImageData.push({
              productItemId: insertedProductItem.raw.insertId,
              imageUrl: library[j],
            });
          }

          // add product image
          await transactionalEntityManager.insert(ProductImage, productImageData);
        }
      }
      return;
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

// add one product
export const addOne = async (req: Request<{}, {}, ProductInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { items, connectIds, tagIds, ...others } = data;
  const { slug } = others;

  try {
    // check product
    const product = await Product.findOneBy({ slug });
    if (product) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Sản phẩm đã tồn tại',
        errors: [{ field: 'slug', message: 'Sản phẩm đã tồn tại' }],
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // add product
      const insertedProduct = await transactionalEntityManager.insert(Product, others);

      if (connectIds.length > 0) {
        // handle data
        let productConnectData = [];
        for (let i = 0; i < connectIds.length; i++) {
          productConnectData.push({
            productId: insertedProduct.raw.insertId,
            connectId: connectIds[i],
          });
        }

        // add product connect
        await transactionalEntityManager.insert(ProductConnect, productConnectData);
      }

      if (tagIds.length > 0) {
        // handle data
        let tagData = [];
        for (let i = 0; i < tagIds.length; i++) {
          tagData.push({
            productId: insertedProduct.raw.insertId,
            tagId: tagIds[i],
          });
        }

        // add product tag
        await transactionalEntityManager.insert(ProductTag, tagData);
      }

      for (let i = 0; i < items.length; i++) {
        const { idx, library, inventory, ...itemOthers } = items[i];

        // add inventory
        const insertedInventory = await transactionalEntityManager.insert(Inventory, inventory);

        // add product item
        const insertedProductItem = await transactionalEntityManager.insert(ProductItem, {
          ...itemOthers,
          productId: insertedProduct.raw.insertId,
          inventoryId: insertedInventory.raw.insertId,
        });

        // handle data
        const variationOptionIds = idx.split('-');
        let productConfigurationData = [];

        for (let j = 0; j < variationOptionIds.length; j++) {
          productConfigurationData.push({
            productItemId: insertedProductItem.raw.insertId,
            variationOptionId: parseInt(variationOptionIds[j]),
          });
        }

        // add product configuration
        await transactionalEntityManager.insert(ProductConfiguration, productConfigurationData);

        // handle data
        let productImageData = [];
        for (let j = 0; j < library.length; j++) {
          productImageData.push({
            productItemId: insertedProductItem.raw.insertId,
            imageUrl: library[j],
          });
        }

        // add product image
        await transactionalEntityManager.insert(ProductImage, productImageData);
      }
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm sản phẩm thành công',
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

// update one product
export const updateOne = async (
  req: Request<{ id: number }, {}, ProductInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;
  const { items, connectIds, tagIds, ...others } = data;

  console.log(data);

  try {
    // check product
    const product = await Product.findOneBy({ id });

    if (!product) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // update product
      await transactionalEntityManager.update(Product, id, others);

      if (connectIds.length > 0) {
        // handle data
        let productConnectData = [];
        for (let i = 0; i < connectIds.length; i++) {
          productConnectData.push({
            productId: id,
            connectId: connectIds[i],
          });
        }

        // add product connect
        await transactionalEntityManager.delete(ProductConnect, { productId: id });

        // add product connect
        await transactionalEntityManager.insert(ProductConnect, productConnectData);
      }

      if (tagIds.length > 0) {
        // handle data
        let tagData = [];
        for (let i = 0; i < tagIds.length; i++) {
          tagData.push({
            productId: id,
            tagId: tagIds[i],
          });
        }

        // add product tag
        await transactionalEntityManager.delete(ProductTag, { productId: id });

        // add product tag
        await transactionalEntityManager.insert(ProductTag, tagData);
      }

      // get product item
      const productItems = await ProductItem.findBy({ productId: id });

      // handle product item id
      const productItemIds: number[] = productItems.map((productItem) => productItem.id);

      // delete product configuration
      await transactionalEntityManager.delete(ProductConfiguration, { productItemId: In(productItemIds) });

      // delete product image
      await transactionalEntityManager.delete(ProductImage, { productItemId: In(productItemIds) });

      // handle inventory id
      const inventoryIds: number[] = productItems.map((productItem) => productItem.inventoryId);

      // delete product item
      await transactionalEntityManager.delete(ProductItem, { productId: id });

      // delete inventory
      await transactionalEntityManager.delete(Inventory, { id: In(inventoryIds) });

      for (let i = 0; i < items.length; i++) {
        const { idx, library, inventory, ...itemOthers } = items[i];

        // add inventory
        const insertedInventory = await transactionalEntityManager.insert(Inventory, inventory);

        // add product item
        const insertedProductItem = await transactionalEntityManager.insert(ProductItem, {
          ...itemOthers,
          productId: id,
          inventoryId: insertedInventory.raw.insertId,
        });

        // handle data
        const variationOptionIds = idx.split('-');
        let productConfigurationData = [];

        for (let j = 0; j < variationOptionIds.length; j++) {
          productConfigurationData.push({
            productItemId: insertedProductItem.raw.insertId,
            variationOptionId: parseInt(variationOptionIds[j]),
          });
        }

        // add product configuration
        await transactionalEntityManager.insert(ProductConfiguration, productConfigurationData);

        // handle data
        let productImageData = [];
        for (let j = 0; j < library.length; j++) {
          productImageData.push({
            productItemId: insertedProductItem.raw.insertId,
            imageUrl: library[j],
          });
        }

        // add product image
        await transactionalEntityManager.insert(ProductImage, productImageData);
      }
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

// update active one product
export const changeActive = async (
  req: Request<{ id: number }, {}, ProductInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check product
    const product = await Product.findOneBy({ id });

    if (!product) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    // update product
    await Product.update(id, data);

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

// delete any product
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check product
      const product = await Product.findOneBy({ id: ids[i] });

      if (!product) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Sản phẩm không tồn tại',
        });
      }
    }

    await Product.update(ids, { deleted: 1 });

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

// delete one product
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check product
    const product = await Product.findOneBy({ id });

    if (!product) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    await Product.update(id, { deleted: 1 });

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
