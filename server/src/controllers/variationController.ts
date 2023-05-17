import { Request, Response } from 'express';
import { Like } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { VariationInput } from '../interfaces/VariationInput';
import { Variation } from '../models/Variation';
import { VariationOption } from './../models/VariationOption';
import { Category } from '../models/Category';
import { VariationCategory } from '../models/VariationCategory';

// get list variation by category slug
export const getListByCategorySlugPublic = async (
  req: Request<{}, {}, {}, { categorySlug: string }>,
  res: Response<CommonResponse<Variation>>,
) => {
  const { categorySlug } = req.query;

  try {
    // check category slug
    const category = await Category.findOneBy({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Danh mục không tồn tại !',
      });
    }

    // find variations
    const variations = await Variation.find({
      where: { variationCategories: { category: { slug: categorySlug } } },
      relations: { variationOptions: true },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả thuộc tính thành công',
      data: variations,
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

// get all variation
export const getAll = async (_req: Request, res: Response<CommonResponse<Variation>>) => {
  try {
    // find variations
    const variations = await Variation.find({ relations: { variationOptions: true } });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả thuộc tính thành công',
      data: variations,
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

// get pagination variation
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Variation>>) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find variations
    const variationRes = await Variation.findAndCount({
      select: {
        id: true,
        name: true,
        slug: true,
        variationOptions: {
          id: true,
          value: true,
        },
      },
      where: [{ name: Like(`%${searchTerm}%`) }, { slug: Like(`%${searchTerm.toLowerCase()}%`) }],
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        variationOptions: true,
        variationCategories: { category: true },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách thuộc tính thành công',
      data: variationRes[0],
      pagination: {
        _limit,
        _page,
        _total: variationRes[1],
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

// get one variation
export const getOneById = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<Variation>>,
) => {
  const { id } = req.params;
  try {
    // find variation
    const variation = await Variation.findOneBy({ id });

    if (!variation) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Thuộc tính không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy thuộc tính thành công',
      data: variation,
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

// add variation
export const addOne = async (req: Request<{}, {}, VariationInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { categoryIds, ...others } = data;
  const { slug } = others;

  try {
    // check variation
    const variation = await Variation.findOneBy({ slug });
    if (variation) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Thuộc tính đã tồn tại',
        errors: [{ field: 'slug', message: 'Thuộc tính đã tồn tại' }],
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // add variation
      const insertedVariation = await transactionalEntityManager.insert(Variation, others);

      if (categoryIds.length > 0) {
        // handle data
        let variationCategoryData = [];
        for (let i = 0; i < categoryIds.length; i++) {
          const category = await Category.findOneBy({ id: categoryIds[i] });
          if (!category) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Thêm thuộc tính thất bại!',
            });
          }

          variationCategoryData.push({
            variationId: insertedVariation.raw.insertId,
            categoryId: categoryIds[i],
          });
        }

        // add variation category
        await transactionalEntityManager.insert(VariationCategory, variationCategoryData);
      }
      return;
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm thuộc tính thành công',
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

// update one variation
export const updateOne = async (
  req: Request<{ id: number }, {}, VariationInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { categoryIds, ...others } = req.body;

  try {
    // check variation
    const variation = await Variation.findOneBy({ id });

    if (!variation) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Thuộc tính không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // update variation
      await transactionalEntityManager.update(Variation, id, others);

      if (categoryIds.length > 0) {
        // handle data
        let variationCategoryData = [];
        for (let i = 0; i < categoryIds.length; i++) {
          const category = await Category.findOneBy({ id: categoryIds[i] });
          if (!category) {
            return res.status(400).json({
              code: 400,
              success: false,
              message: 'Cập nhật thuộc tính thất bại!',
            });
          }

          variationCategoryData.push({
            variationId: id,
            categoryId: categoryIds[i],
          });
        }

        // delete variation category
        await transactionalEntityManager.delete(VariationCategory, { variationId: id });

        // add variation category
        await transactionalEntityManager.insert(VariationCategory, variationCategoryData);
      }
      return;
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật thuộc tính thành công',
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

// delete any variation
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check variation
      const variation = await Variation.findOneBy({ id: ids[i] });

      if (!variation) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Thuộc tính không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete variation option
      await transactionalEntityManager.delete(VariationOption, { variationId: ids });

      // delete variation category
      await transactionalEntityManager.delete(VariationCategory, { variationId: ids });

      // delete variation
      await transactionalEntityManager.delete(Variation, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách thuộc tính thành công',
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

// delete one variation
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check variation
    const variation = await Variation.findOneBy({ id });

    if (!variation) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Thuộc tính không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete variation option
      await transactionalEntityManager.delete(VariationOption, { variationId: id });

      // delete variation category
      await transactionalEntityManager.delete(VariationCategory, { variationId: id });

      // delete variation
      await transactionalEntityManager.delete(Variation, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa thuộc tính thành công',
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
