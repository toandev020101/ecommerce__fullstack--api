import { ProductConfiguration } from './../models/ProductConfiguration';
import { VariationOption } from './../models/VariationOption';
import { Request, Response } from 'express';
import { Like } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { VariationOptionInput } from '../interfaces/VariationOptionInput';

// get list variationOptions
export const getListByVariationId = async (
  req: Request<{ variationId: number }, {}, {}, {}>,
  res: Response<CommonResponse<VariationOption>>,
) => {
  const { variationId } = req.params;

  try {
    // find variationOptions
    const variationOptions = await VariationOption.findBy({ variationId });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách chủng loại thành công',
      data: variationOptions,
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

// get list variationOptions
export const getListBySearchTermAndVariationId = async (
  req: Request<{ variationId: number }, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<VariationOption>>,
) => {
  const { variationId } = req.params;
  const { searchTerm } = req.query;

  try {
    // find variationOptions
    const variationOptions = await VariationOption.findBy({
      variationId,
      value: Like(`%${searchTerm.toLowerCase()}%`),
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách chủng loại thành công',
      data: variationOptions,
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

// get pagination variation option
export const getPaginationByVariationId = async (
  req: Request<{ variationId: number }, {}, {}, ListParams>,
  res: Response<CommonResponse<VariationOption>>,
) => {
  const { variationId } = req.params;
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find variationOptions
    const variationOptionRes = await VariationOption.findAndCount({
      select: {
        id: true,
        value: true,
        slug: true,
      },
      where: [
        { variationId, value: Like(`%${searchTerm.toLowerCase()}%`) },
        { variationId, slug: Like(`%${searchTerm.toLowerCase()}%`) },
      ],
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách chủng loại thành công',
      data: variationOptionRes[0],
      pagination: {
        _limit,
        _page,
        _total: variationOptionRes[1],
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

// get one variationOption
export const getOneById = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<VariationOption>>,
) => {
  const { id } = req.params;
  try {
    // find variationOption
    const variationOption = await VariationOption.findOneBy({ id });

    if (!variationOption) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Chủng loại không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy chủng loại thành công',
      data: variationOption,
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
export const addOne = async (req: Request<{}, {}, VariationOptionInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { slug } = data;

  try {
    // check variationOption
    const variation = await VariationOption.findOneBy({ slug });
    if (variation) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Chủng loại đã tồn tại',
        errors: [{ field: 'slug', message: 'Chủng loại đã tồn tại' }],
      });
    }

    await VariationOption.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm chủng loại thành công',
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

// update one variationOption
export const updateOne = async (
  req: Request<{ id: number }, {}, VariationOptionInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check variationOption
    const variationOption = await VariationOption.findOneBy({ id });

    if (!variationOption) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Chủng loại không tồn tại',
      });
    }

    // update variationOption
    await VariationOption.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật chủng loại thành công',
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

// delete any variationOption
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check variationOption
      const variationOption = await VariationOption.findOneBy({ id: ids[i] });

      if (!variationOption) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Chủng loại không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete product configuration
      await transactionalEntityManager.delete(ProductConfiguration, { variationOptionId: ids });

      // delete variation option
      await transactionalEntityManager.delete(VariationOption, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách chủng loại thành công',
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

// delete one variationOption
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check variationOption
    const variationOption = await VariationOption.findOneBy({ id });

    if (!variationOption) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Chủng loại không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete product configuration
      await transactionalEntityManager.delete(ProductConfiguration, { variationOptionId: id });

      // delete variation option
      await transactionalEntityManager.delete(VariationOption, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa chủng loại thành công',
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
