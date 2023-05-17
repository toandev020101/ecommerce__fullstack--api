import { Request, Response } from 'express';
import { Like } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { TagInput } from './../interfaces/TagInput';
import { ProductTag } from './../models/ProductTag';
import { Tag } from './../models/Tag';

// get all tags
export const getAll = async (_req: Request, res: Response<CommonResponse<Tag>>) => {
  try {
    // find tags
    const tags = await Tag.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả từ khóa thành công',
      data: tags,
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

// get list tags
export const getListBySearchTerm = async (
  req: Request<{}, {}, {}, { searchTerm: string }>,
  res: Response<CommonResponse<Tag>>,
) => {
  const { searchTerm } = req.query;

  try {
    // find tags
    const tags = await Tag.findBy({ name: Like(`%${searchTerm.toLowerCase()}%`) });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách từ khóa thành công',
      data: tags,
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

// get pagination tag
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Tag>>) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    // find tags
    const tagRes = await Tag.findAndCount({
      where: [{ name: Like(`%${searchTerm.toLowerCase()}%`) }, { slug: Like(`%${searchTerm.toLowerCase()}%`) }],
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách từ khóa thành công',
      data: tagRes[0],
      pagination: {
        _limit,
        _page,
        _total: tagRes[1],
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

// get one tag
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Tag>>) => {
  const { id } = req.params;
  try {
    // find tag
    const tag = await Tag.findOneBy({ id });

    if (!tag) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Từ khóa không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy từ khóa thành công',
      data: tag,
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

// add tag
export const addOne = async (req: Request<{}, {}, TagInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { slug } = data;

  try {
    // check tag
    const tag = await Tag.findOneBy({ slug });
    if (tag) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Từ khóa đã tồn tại',
        errors: [{ field: 'slug', message: 'Từ khóa đã tồn tại' }],
      });
    }

    await Tag.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm từ khóa thành công',
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

// update one tag
export const updateOne = async (
  req: Request<{ id: number }, {}, TagInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check tag
    const tag = await Tag.findOneBy({ id });

    if (!tag) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Từ khóa không tồn tại',
      });
    }

    // update tag
    await Tag.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật từ khóa thành công',
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

// delete any tag
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check tag
      const tag = await Tag.findOneBy({ id: ids[i] });

      if (!tag) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Từ khóa không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete product tag
      await transactionalEntityManager.delete(ProductTag, { tagId: ids });

      // delete tag
      await transactionalEntityManager.delete(Tag, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách từ khóa thành công',
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

// delete one tag
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check tag
    const tag = await Tag.findOneBy({ id });

    if (!tag) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Từ khóa không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete product tag
      await transactionalEntityManager.delete(ProductTag, { tagId: id });

      // delete tag
      await transactionalEntityManager.delete(Tag, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa từ khóa thành công',
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
