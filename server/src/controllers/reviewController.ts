import { ReviewImage } from './../models/ReviewImage';
import { ReviewInput } from './../interfaces/ReviewInput';
import { Review } from './../models/Review';
import { Request, Response } from 'express';
import { IsNull, Like, Not } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';

// get pagination review
export const getPaginationByProductId = async (
  req: Request<{ productId: number }, {}, {}, ListParams>,
  res: Response<CommonResponse<Review>>,
) => {
  const { productId } = req.params;
  const { _limit, _page, _sort, _order, star, isImage, searchTerm } = req.query;

  let whereOptions: any[] = [
    {
      comment: Like(`%${searchTerm.toLowerCase()}%`),
      orderLine: { productItem: { product: { id: productId } } },
      status: 1,
      type: 0,
    },
    {
      user: { fullName: Like(`%${searchTerm.toLowerCase()}%`) },
      orderLine: { productItem: { product: { id: productId } } },
      status: 1,
      type: 0,
    },
    {
      user: { username: Like(`%${searchTerm.toLowerCase()}%`) },
      orderLine: { productItem: { product: { id: productId } } },
      status: 1,
      type: 0,
    },
  ];

  if (star && parseInt(star) !== 0) {
    const newWhereOptions: any[] = [];
    whereOptions.forEach((whereOption) => {
      newWhereOptions.push({ ...whereOption, ratingValue: parseInt(star) });
    });
    whereOptions = [...newWhereOptions];
  }

  if (isImage === 'true') {
    const newWhereOptions: any[] = [];
    whereOptions.forEach((whereOption) => {
      newWhereOptions.push({ ...whereOption, reviewImages: { id: Not(IsNull()) } });
    });
    whereOptions = [...newWhereOptions];
  }

  try {
    // find reviews
    const reviewRes = await Review.findAndCount({
      where: whereOptions,
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        user: true,
        orderLine: { productItem: { product: true } },
        reviewImages: true,
        reply: { user: { role: true } },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách đánh giá thành công',
      data: reviewRes[0],
      pagination: {
        _limit,
        _page,
        _total: reviewRes[1],
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

// get pagination review
export const getPagination = async (req: Request<{}, {}, {}, ListParams>, res: Response<CommonResponse<Review>>) => {
  const { _limit, _page, _sort, _order, status, searchTerm } = req.query;

  try {
    // find reviews
    const reviewRes = await Review.findAndCount({
      where:
        status !== ''
          ? [
              { comment: Like(`%${searchTerm.toLowerCase()}%`), status },
              { user: { fullName: Like(`%${searchTerm.toLowerCase()}%`) }, status },
              { user: { username: Like(`%${searchTerm.toLowerCase()}%`) }, status },
            ]
          : [
              { comment: Like(`%${searchTerm.toLowerCase()}%`) },
              { user: { fullName: Like(`%${searchTerm.toLowerCase()}%`) } },
              { user: { username: Like(`%${searchTerm.toLowerCase()}%`) } },
            ],
      skip: _page * _limit,
      take: _limit,
      order: { [_sort]: _order },
      relations: {
        user: true,
        orderLine: { productItem: { product: true } },
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách đánh giá thành công',
      data: reviewRes[0],
      pagination: {
        _limit,
        _page,
        _total: reviewRes[1],
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

// get list review
export const getListByProductId = async (
  req: Request<{ productId: number }, {}, {}, {}>,
  res: Response<CommonResponse<Review>>,
) => {
  const { productId } = req.params;
  try {
    // find reviews
    const reviews = await Review.find({
      where: { orderLine: { productItem: { product: { id: productId } } }, status: 1, type: 0 },
      relations: {
        orderLine: { productItem: { product: true } },
        reviewImages: true,
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách đánh giá thành công',
      data: reviews,
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

// get one review
export const getOneById = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<Review>>) => {
  const { id } = req.params;
  try {
    // find review
    const review = await Review.findOne({
      where: { id },
      relations: {
        orderLine: { productItem: { product: true } },
        reviewImages: true,
      },
    });

    if (!review) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đánh giá không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy đánh giá thành công',
      data: review,
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

// get one review
export const getOneByOrderLinedId = async (
  req: Request<{ orderLinedId: number }, {}, {}, {}>,
  res: Response<CommonResponse<Review>>,
) => {
  const { orderLinedId } = req.params;
  try {
    // find review
    const review = await Review.findOne({
      where: { orderLinedId },
      relations: {
        orderLine: { productItem: { product: true } },
        reviewImages: true,
      },
    });

    if (!review) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đánh giá không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy đánh giá thành công',
      data: review,
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

// add review
export const addOne = async (req: Request<{}, {}, ReviewInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const userId = req.userId;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const { images, ...others } = data;

      // add review
      const insertedReview = await transactionalEntityManager.insert(Review, {
        ...others,
        userId,
      });

      // handle data
      const newReviewImages: any[] = [];
      images.forEach((image) => {
        newReviewImages.push({
          imageUrl: image,
          reviewId: insertedReview.raw.insertId,
        });
      });

      // add review image
      await transactionalEntityManager.insert(ReviewImage, newReviewImages);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: `Thêm ${data.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
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

// update one review
export const updateOne = async (
  req: Request<{ id: number }, {}, ReviewInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check review
    const review = await Review.findOneBy({ id });

    if (!review) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: `${data.type === 0 ? 'Đánh giá' : 'Phản hồi'} không tồn tại`,
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const { images, ...others } = data;

      // update review
      await transactionalEntityManager.update(Review, id, { ...others });

      // handle data
      const newReviewImages: any[] = [];
      images.forEach((image) => {
        newReviewImages.push({
          imageUrl: image,
          reviewId: id,
        });
      });

      // delete review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: id });

      // add review image
      await transactionalEntityManager.insert(ReviewImage, newReviewImages);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: `Cập nhật ${data.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
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

// update one review status
export const changeStatus = async (
  req: Request<{ id: number }, {}, { status: number }, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // check review
    const review = await Review.findOneBy({ id });

    if (!review) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đánh giá hoặc phản hồi không tồn tại',
      });
    }

    // update
    await Review.update(id, { status });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: `Cập nhật trạng thái ${review.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
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

// delete review
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check review
      const review = await Review.findOneBy({ id: ids[i] });

      if (!review) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Đánh giá hoặc phản hồi không tồn tại',
        });
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: ids });

      // delete reply
      await transactionalEntityManager.delete(Review, { reviewId: ids });

      // delete review
      await transactionalEntityManager.delete(Review, ids);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách đánh giá hoặc phản hồi thành công',
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

// delete one review
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check review
    const review = await Review.findOneBy({ id });

    if (!review) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Đánh giá hoặc phản hồi không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      // delete review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: id });

      // delete reply
      await transactionalEntityManager.delete(Review, { reviewId: id });

      // delete review
      await transactionalEntityManager.delete(Review, id);
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: `Xóa ${review.type === 0 ? 'đánh giá' : 'phản hồi'} thành công`,
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
