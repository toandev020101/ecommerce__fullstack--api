import { Request, Response } from 'express';
import { In, Like } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { Category } from '../models/Category';
import { Inventory } from '../models/Inventory';
import { ProductConfiguration } from '../models/ProductConfiguration';
import { ProductConnect } from '../models/ProductConnect';
import { ProductImage } from '../models/ProductImage';
import { ProductItem } from '../models/ProductItem';
import { ProductTag } from '../models/ProductTag';
import { Tag } from '../models/Tag';
import { VariationOption } from '../models/VariationOption';
import { ProductInput } from './../interfaces/ProductInput';
import { Product } from './../models/Product';

// get all products
export const getAll = async (_req: Request, res: Response<CommonResponse<Product>>) => {
  try {
    // find products
    const products = await Product.find({
      where: { deleted: 0, productItems: { deleted: 0 } },
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
    const products = await Product.find({
      where: [
        { name: Like(`%${searchTerm.toLowerCase()}%`), deleted: 0, productItems: { deleted: 0 } },
        { deleted: 0, productItems: { deleted: 0, price: Like(`%${searchTerm.toLowerCase()}%`) } },
        {
          productTags: { tag: { name: Like(`%${searchTerm.toLowerCase()}%`) } },
          deleted: 0,
          productItems: { deleted: 0 },
        },
      ],
      relations: {
        productItems: {
          productConfigurations: {
            variationOption: true,
          },
        },
        category: true,
        productTags: { tag: true },
      },
    });

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

// get list products
export const getListByIds = async (
  req: Request<{}, {}, {}, { ids: number[] }>,
  res: Response<CommonResponse<Product>>,
) => {
  const { ids } = req.query;
  try {
    // find products
    const products = await Product.find({
      where: { id: In(ids), deleted: 0, productItems: { deleted: 0 } },
      relations: {
        productItems: {
          inventory: true,
        },
      },
    });

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

// get pagination product by category slug public
export const getPaginationByCategorySlugPublic = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<Product>>,
) => {
  const {
    _limit,
    _page,
    _sort,
    _order,
    categorySlug,
    price,
    categoryFilters,
    variationFilters,
    statusFilters,
    ratingFilters,
  } = req.query;

  try {
    // check category slug
    const categories = await Category.find({ where: [{ slug: categorySlug }, { parent: { slug: categorySlug } }] });

    // find products
    const productRepository = AppDataSource.getRepository(Product);
    const queryBuilder = productRepository.createQueryBuilder('product');
    queryBuilder
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.imageUrl',
        'product.isHot',
        'product.isActive',
        'product.createdAt',
        'category.id',
        'category.name',
        'category.slug',
        'productItems.id',
        'productItems.productId',
        'productItems.inventoryId',
        'productItems.price',
        'productItems.discount',
        'productItems.discountStartDate',
        'productItems.discountEndDate',
        'inventory.id',
        'inventory.quantity',
        'productConfigurations.id',
        'productConfigurations.variationOptionId',
        'variationOption.id',
        'variationOption.value',
        'variationOption.variationId',
        'reviews.id',
        'reviews.ratingValue',
        'reviews.status',
      ])
      .leftJoin('product.category', 'category')
      .leftJoin('product.productItems', 'productItems')
      .leftJoin('productItems.inventory', 'inventory')
      .leftJoin(
        'productItems.productConfigurations',
        'productConfigurations',
        'productConfigurations.productItemId = productItems.id',
      )
      .leftJoin('productConfigurations.variationOption', 'variationOption')
      .leftJoin('productItems.orderLines', 'orderLines', 'productItems.id = orderLines.productItemId')
      .leftJoin('orderLines.reviews', 'reviews')
      .andWhere('product.deleted = :deleted', { deleted: 0 })
      .andWhere('product.isActive = :isActive', { isActive: 1 })
      .andWhere('productItems.deleted = :deleted', { deleted: 0 });

    let queryString = '(product.categoryId in(';
    categories.forEach((category, index: number) => {
      queryString += `${category.id}`;
      if (index !== categories.length - 1) {
        queryString += ', ';
      }
    });
    queryString += '))';
    queryBuilder.andWhere(queryString);

    if (categoryFilters) {
      let queryString = '(';
      categoryFilters.forEach((categoryFilter: number, index: number) => {
        queryString += `category.id = ${categoryFilter}`;
        if (index !== categoryFilters.length - 1) {
          queryString += ' or ';
        }
      });
      queryString += ')';
      queryBuilder.andWhere(queryString);
    }

    if (statusFilters) {
      statusFilters.forEach((statusFilter: string) => {
        if (statusFilter === 'isHot') {
          queryBuilder.andWhere('product.isHot = :isHot', { isHot: 1 });
        }
      });
    }

    if (_sort === 'price') {
      queryBuilder.orderBy('productItems.price', _order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy(`product.${_sort}`, _order.toUpperCase() as 'ASC' | 'DESC');
    }

    // raw data
    const products: any[] = await queryBuilder.getRawMany();

    // handle data
    let data: any[] = [];
    products.forEach((product: any) => {
      const dataIndex = data.findIndex((dataItem) => dataItem.id === product.product_id);
      if (dataIndex === -1) {
        data.push({
          id: product.product_id,
          name: product.product_name,
          slug: product.product_slug,
          imageUrl: product.product_imageUrl,
          isHot: product.product_isHot,
          isActive: product.product_isActive,
          createdAt: product.product_createdAt,
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug,
          },
          productItems: [
            {
              id: product.productItems_id,
              price: product.productItems_price,
              discount: product.productItems_discount,
              discountStartDate: product.productItems_discountStartDate,
              discountEndDate: product.productItems_discountEndDate,
              inventoryId: product.productItems_inventoryId,
              productId: product.productItems_productId,
              inventory: {
                id: product.inventory_id,
                quantity: product.inventory_quantity,
              },
              productConfigurations: [
                {
                  id: product.productConfigurations_id,
                  variationOptionId: product.productConfigurations_variationOptionId,
                  variationOption: {
                    id: product.variationOption_id,
                    value: product.variationOption_value,
                    variationId: product.variationOption_variationId,
                  },
                },
              ],
              reviews: [
                {
                  id: product.reviews_id,
                  ratingValue: product.reviews_ratingValue,
                  status: product.reviews_status,
                },
              ],
            },
          ],
        });
      } else {
        const productItemIndex = data[dataIndex].productItems.findIndex(
          (productItem: any) => productItem.id === product.productItems_id,
        );

        if (productItemIndex === -1) {
          data[dataIndex].productItems.push({
            id: product.productItems_id,
            price: product.productItems_price,
            discount: product.productItems_discount,
            discountStartDate: product.productItems_discountStartDate,
            discountEndDate: product.productItems_discountEndDate,
            inventoryId: product.productItems_inventoryId,
            productId: product.productItems_productId,
            inventory: {
              id: product.inventory_id,
              quantity: product.inventory_quantity,
            },
            productConfigurations: [
              {
                id: product.productConfigurations_id,
                variationOptionId: product.productConfigurations_variationOptionId,
                variationOption: {
                  id: product.variationOption_id,
                  value: product.variationOption_value,
                  variationId: product.variationOption_variationId,
                },
              },
            ],
            reviews: [
              {
                id: product.reviews_id,
                ratingValue: product.reviews_ratingValue,
                status: product.reviews_status,
              },
            ],
          });
        } else {
          const productConfigurationIndex = data[dataIndex].productItems[
            data[dataIndex].productItems.length - 1
          ].productConfigurations.findIndex(
            (productConfiguration: any) => productConfiguration.id === product.productConfigurations_id,
          );

          if (productConfigurationIndex === -1) {
            data[dataIndex].productItems[data[dataIndex].productItems.length - 1].productConfigurations.push({
              id: product.productConfigurations_id,
              variationOptionId: product.productConfigurations_variationOptionId,
              variationOption: {
                id: product.variationOption_id,
                value: product.variationOption_value,
                variationId: product.variationOption_variationId,
              },
            });
          }

          const reviewIndex = data[dataIndex].productItems[data[dataIndex].productItems.length - 1].reviews.findIndex(
            (review: any) => review.id === product.reviews_id,
          );

          if (reviewIndex === -1) {
            data[dataIndex].productItems[data[dataIndex].productItems.length - 1].reviews.push({
              id: product.reviews_id,
              ratingValue: product.reviews_ratingValue,
              status: product.reviews_status,
            });
          }
        }
      }
    });

    //  delete review status 0

    data.forEach((product) => {
      product.productItems.forEach((productItem: any) => {
        const newReviews: any[] = [];
        productItem.reviews.forEach((review: any) => {
          if (review.status !== 0) {
            newReviews.push(review);
          }
        });
        productItem.reviews = newReviews;
      });
    });

    if (ratingFilters) {
      const newData: any[] = [];
      data.forEach((product) => {
        // ratingAvgNumber
        let ratingValueTotal = 0;
        let ratingValueLength = 0;
        product.productItems.forEach((productItem: any) => {
          productItem.reviews.forEach((review: any) => {
            if (review.id != null) {
              ratingValueTotal += review.ratingValue;
              ratingValueLength++;
            }
          });
        });

        let ratingAvgNumber = 0;
        if (ratingValueLength > 0) {
          ratingAvgNumber = parseFloat((ratingValueTotal / ratingValueLength).toFixed(1));
        }

        ratingFilters.sort(
          (ratingFilter1: string, ratingFilter2: string) => parseInt(ratingFilter1) - parseInt(ratingFilter2),
        );

        if (ratingAvgNumber >= parseInt(ratingFilters[0])) {
          newData.push(product);
        }
      });

      data = [...newData];
    }

    if (price) {
      const currentDate = new Date();
      const newData: any[] = [];

      data.forEach((product) => {
        const priceArr = product.productItems.map((productItem: any) => {
          const discountStartDate = new Date(productItem.discountStartDate);
          const discountEndDate = new Date(productItem.discountEndDate);

          if (discountStartDate <= currentDate && discountEndDate >= currentDate) {
            return productItem.discount;
          }

          return productItem.price;
        });

        // max -> min
        priceArr.sort((price1: number, price2: number) => price2 - price1);

        if (priceArr[0] >= price.priceFrom && priceArr[0] <= price.priceTo) {
          newData.push(product);
        }
      });

      data = newData;
    }

    // filter by variation Option
    if (variationFilters) {
      const newData: any[] = [];
      data.forEach((product) => {
        product.productItems.forEach((productItem: any) => {
          productItem.productConfigurations.forEach((productConfiguration: any) => {
            variationFilters.forEach((variationFilter: any) => {
              if (
                productConfiguration.variationOption.variationId === parseInt(variationFilter.id) &&
                variationFilter.values.includes(productConfiguration.variationOptionId.toString())
              ) {
                const newDataIndex = newData.findIndex((productData) => productData.id === product.id);
                if (newDataIndex === -1) {
                  newData.push(product);
                }
              }
            });
          });
        });
      });
      data = newData;
    }

    // filter by inventory status
    if (statusFilters) {
      statusFilters.forEach((statusFilter: string) => {
        if (statusFilter === 'inStock') {
          const dataFilter = data.map((product) => {
            let quantityTotal = 0;
            product.productItems.forEach((productItem: any) => {
              quantityTotal += productItem.inventory.quantity;
            });

            if (quantityTotal > 0) return product;
            return null;
          });
          data = dataFilter.filter((dataItem) => dataItem !== null);
        }
      });
    }

    // handle pagination data
    const dataPagination: any[] = [];
    data.forEach((dataItem, index) => {
      const skip = _page * _limit;
      if (index >= skip && dataPagination.length < _limit) {
        dataPagination.push(dataItem);
      }
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: dataPagination,
      pagination: {
        _limit,
        _page,
        _total: data.length,
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

// get pagination product
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Product>>) => {
  const { _limit, _page, _sort, _order, categoryId, inventoryStatus, isActive, searchTerm } = req.query;

  try {
    // find products
    const productRepository = AppDataSource.getRepository(Product);
    const queryBuilder = productRepository.createQueryBuilder('product');
    queryBuilder
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.imageUrl',
        'product.isHot',
        'product.isActive',
        'category.id',
        'category.name',
        'category.slug',
        'productTags.id',
        'productTags.productId',
        'productTags.tagId',
        'tag.id',
        'tag.name',
        'productItems.id',
        'productItems.productId',
        'productItems.inventoryId',
        'productItems.price',
        'productItems.discount',
        'productItems.discountStartDate',
        'productItems.discountEndDate',
        'inventory.id',
        'inventory.quantity',
      ])
      .leftJoin('product.category', 'category')
      .leftJoin('product.productTags', 'productTags')
      .leftJoin('productTags.tag', 'tag')
      .leftJoin('product.productItems', 'productItems', 'productItems.productId = product.id')
      .leftJoin('productItems.inventory', 'inventory')
      .where('product.deleted = :deleted', { deleted: 0 })
      .andWhere('productItems.deleted = :deleted', { deleted: 0 });

    if (categoryId && categoryId !== '') {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (isActive && isActive !== '') {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive });
    }

    if (searchTerm && searchTerm !== '') {
      queryBuilder.andWhere(
        `product.name like '%${searchTerm.toLowerCase()}%' OR product.slug like '%${searchTerm.toLowerCase()}%'`,
      );
    }

    if (_sort === 'price') {
      queryBuilder.orderBy('productItems.price', _order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy(`product.${_sort}`, _order.toUpperCase() as 'ASC' | 'DESC');
    }

    const products: any[] = await queryBuilder.getRawMany();

    // handle data
    let data: any[] = [];
    products.forEach((product: any) => {
      const dataIndex = data.findIndex((dataItem) => dataItem.id === product.product_id);
      if (dataIndex === -1) {
        data.push({
          id: product.product_id,
          name: product.product_name,
          slug: product.product_slug,
          imageUrl: product.product_imageUrl,
          isHot: product.product_isHot,
          isActive: product.product_isActive,
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug,
          },
          productTags: product.productTags_tagId
            ? [
                {
                  id: product.productTags_id,
                  productId: product.productTags_productId,
                  tagId: product.productTags_tagId,
                  tag: {
                    id: product.tag_id,
                    name: product.tag_name,
                  },
                },
              ]
            : [],

          productItems: [
            {
              id: product.productItems_id,
              price: product.productItems_price,
              discount: product.productItems_discount,
              discountStartDate: product.productItems_discountStartDate,
              discountEndDate: product.productItems_discountEndDate,
              inventoryId: product.productItems_inventoryId,
              productId: product.productItems_productId,
              inventory: {
                id: product.inventory_id,
                quantity: product.inventory_quantity,
              },
            },
          ],
        });
      } else {
        if (product.productTags_tagId) {
          const productTagIndex = data[dataIndex].productTags.findIndex(
            (productTag: any) => productTag.tagId === product.productTags_tagId,
          );

          if (productTagIndex === -1) {
            data[dataIndex].productTags.push({
              id: product.productTags_id,
              productId: product.productTags_productId,
              tagId: product.productTags_tagId,
              tag: {
                id: product.tag_id,
                name: product.tag_name,
              },
            });
          }
        }

        const productItemIndex = data[dataIndex].productItems.findIndex(
          (productItem: any) => productItem.id === product.productItems_id,
        );

        if (productItemIndex === -1) {
          data[dataIndex].productItems.push({
            id: product.productItems_id,
            price: product.productItems_price,
            discount: product.productItems_discount,
            discountStartDate: product.productItems_discountStartDate,
            discountEndDate: product.productItems_discountEndDate,
            inventoryId: product.productItems_inventoryId,
            productId: product.productItems_productId,
            inventory: {
              id: product.inventory_id,
              quantity: product.inventory_quantity,
            },
          });
        }
      }
    });

    // filter by inventory status
    if (inventoryStatus && inventoryStatus !== '') {
      const dataFilter = data.map((product) => {
        let quantityTotal = 0;
        product.productItems.forEach((productItem: any) => {
          quantityTotal += productItem.inventory.quantity;
        });

        if (
          (parseInt(inventoryStatus) === 1 && quantityTotal > 0) ||
          (parseInt(inventoryStatus) === 0 && quantityTotal === 0)
        )
          return product;
        return null;
      });
      data = dataFilter.filter((dataItem) => dataItem !== null);
    }

    // handle pagination data
    const dataPagination: any[] = [];
    data.forEach((dataItem, index) => {
      const skip = _page * _limit;
      if (index >= skip && dataPagination.length < _limit) {
        dataPagination.push(dataItem);
      }
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: dataPagination,
      pagination: {
        _limit,
        _page,
        _total: data.length,
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

// get one product by slug public
export const getOneBySlugPublic = async (
  req: Request<{ slug: string }, {}, {}, {}>,
  res: Response<CommonResponse<Product>>,
) => {
  const { slug } = req.params;
  try {
    // find product
    const product = await Product.findOne({
      where: { slug, deleted: 0, productItems: { deleted: 0 } },
      relations: {
        category: true,
        productTags: { tag: true },
        productItems: {
          inventory: true,
          productConfigurations: {
            variationOption: {
              variation: true,
            },
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

// get one product
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Product>>) => {
  const { id } = req.params;
  try {
    // find product
    const product = await Product.findOne({
      where: { id, deleted: 0, productItems: { deleted: 0 } },
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

// add any product
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
            const variationOption = await VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
            if (!variationOption) {
              return res.status(400).json({
                code: 400,
                success: false,
                message: 'Thêm danh sách sản phẩm thất bại!',
              });
            }

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
          const product = await Product.findOneBy({ id: connectIds[i] });
          if (!product) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Thêm sản phẩm thất bại!',
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
              message: 'Thêm sản phẩm thất bại!',
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
          const variationOption = await VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
          if (!variationOption) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Thêm sản phẩm thất bại!',
            });
          }

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
      return;
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
          const product = await Product.findOneBy({ id: connectIds[i] });
          if (!product) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Cập nhật sản phẩm thất bại!',
            });
          }

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
          const tag = await Tag.findOneBy({ id: tagIds[i] });
          if (!tag) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Cập nhật sản phẩm thất bại!',
            });
          }

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

      productItemIds.forEach(async (productItemId) => {
        // delete product item
        await transactionalEntityManager.update(ProductItem, productItemId, { deleted: 1 });
      });

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
          const variationOption = await VariationOption.findOneBy({ id: parseInt(variationOptionIds[j]) });
          if (!variationOption) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Cập nhật sản phẩm thất bại!',
            });
          }

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
      return;
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

// update attribute one product
export const changeAttribute = async (
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
