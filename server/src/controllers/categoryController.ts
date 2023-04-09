import { Request, Response } from 'express';
import { In } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { CategoryInput } from './../interfaces/CategoryInput';
import { Category } from './../models/Category';
import { Product } from './../models/Product';

// get all categories
export const getAll = async (_req: Request, res: Response<CommonResponse<Category>>) => {
  try {
    // find categories
    const categories = await Category.find();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả danh mục thành công',
      data: categories,
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

// get pagination category and parent
export const getPaginationAndParent = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<Category>>,
) => {
  const { _limit, _page, _sort, _order, searchTerm } = req.query;

  try {
    const userRepository = AppDataSource.getRepository(Category);
    const queryBuilder = userRepository.createQueryBuilder('category');

    // find categories
    queryBuilder.select([
      'category.id',
      'category.imageUrl',
      'category.name',
      'category.slug',
      'category.level',
      'category.isActive',
      'parent.id',
      'parent.name',
    ]);

    queryBuilder.leftJoin('category.parent', 'parent');

    if (searchTerm && searchTerm !== '') {
      queryBuilder.andWhere(`category.name like '%${searchTerm}%'`).orWhere(`category.slug like '%${searchTerm}%'`);
    }

    if (_limit && _page) {
      queryBuilder.skip(_page * _limit);
      queryBuilder.take(_limit);
    }

    if (_sort && _order) {
      queryBuilder.orderBy(
        _sort === 'parentId' ? 'parent.name' : `category.${_sort}`,
        _order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    const categories = await queryBuilder.getMany();

    const total = await queryBuilder.getCount();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách danh mục thành công',
      data: categories,
      pagination: {
        _limit,
        _page,
        _total: total,
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

// get one category and parent
export const getOneAndParentById = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<Category>>,
) => {
  const { id } = req.params;
  try {
    // find category
    const category = await Category.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Danh mục không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh mục thành công',
      data: category,
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

// add category
export const addOne = async (req: Request<{}, {}, CategoryInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { slug } = data;

  try {
    // check category
    const category = await Category.findOneBy({ slug });
    if (category) {
      // send results
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Danh mục đã tồn tại',
        errors: [{ field: 'slug', message: 'Danh mục đã tồn tại' }],
      });
    }

    await Category.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm danh mục thành công',
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

// update one category
export const updateOne = async (
  req: Request<{ id: number }, {}, CategoryInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check category
    const category = await Category.findOneBy({ id });

    if (!category) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }

    // update category
    await Category.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật danh mục thành công',
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

// delete any category
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check category
      const category = await Category.findOneBy({ id: ids[i] });

      if (!category) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Danh mục không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // get child id
      const childs = await Category.findBy({ parentId: In(ids) });

      const childIds = childs.map((child) => child.id);

      // delete product
      await transactionalEntityManager.update(Product, { categoryId: childIds }, { deleted: 1 });

      // delete child
      await transactionalEntityManager.delete(Category, { parentId: childIds });

      // delete category
      await transactionalEntityManager.delete(Category, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách danh mục thành công',
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

// delete one category
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check category
    const category = await Category.findOneBy({ id });

    if (!category) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Danh mục không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // get child id
      const childs = await Category.findBy({ parentId: id });

      const childIds = childs.map((child) => child.id);

      // delete product
      await transactionalEntityManager.update(Product, { categoryId: childIds }, { deleted: 1 });

      // delete child
      await transactionalEntityManager.delete(Category, { parentId: childIds });

      // delete category
      await transactionalEntityManager.delete(Category, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh mục thành công',
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
