import { removeFile } from './../utils/file';
import { Request, Response } from 'express';
import AppDataSource from '../AppDataSource';
import { CommonResponse, ListParams } from '../interfaces/common';
import { Media } from './../models/Media';
import { In } from 'typeorm';

interface MediaItem {
  fileUrl: string;
  name: string;
  mimetype: string;
  size: string;
  type: number;
  path: string;
  userId: number;
}

// get pagination media and user
export const getPaginationAndUser = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<Media>>,
) => {
  const { _limit, _page, _sort, _order, type, date, searchTerm } = req.query;

  try {
    const userRepository = AppDataSource.getRepository(Media);
    const queryBuilder = userRepository.createQueryBuilder('media');

    // find users
    queryBuilder.select([
      'media.id',
      'media.fileUrl',
      'media.name',
      'media.mimetype',
      'media.size',
      'media.path',
      'media.createdAt',
      'user.id',
      'user.username',
    ]);

    queryBuilder.leftJoin('media.user', 'user');

    if (type && type !== '') {
      queryBuilder.andWhere(`media.type = ${type}`);
    }

    if (date && date !== '') {
      const newDate = new Date(date);
      queryBuilder.andWhere(
        `MONTH(media.createdAt) = ${newDate.getMonth() + 1} AND YEAR(media.createdAt) = ${newDate.getFullYear()}`,
      );
    }

    if (searchTerm && searchTerm !== '') {
      queryBuilder.andWhere(`media.name like '%${searchTerm}%'`);
    }

    if (_limit && _page) {
      queryBuilder.take((_page + 1) * _limit);
    }

    if (_sort && _order) {
      queryBuilder.orderBy(`media.${_sort}`, _order.toUpperCase() as 'ASC' | 'DESC');
    }

    const medias = await queryBuilder.getMany();

    const total = await queryBuilder.getCount();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách file thành công',
      data: medias,
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

// get all date
export const getAllDate = async (_req: Request, res: Response<CommonResponse<Date>>) => {
  try {
    // get all createdAt
    const medias = await Media.find({ select: { createdAt: true } });

    // filter dates
    let dates: Date[] = [];
    for (let i = 0; i < medias.length; i++) {
      dates.push(medias[i].createdAt);
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả ngày thành công',
      data: dates,
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

// add any media
export const addAny = async (req: Request, res: Response<CommonResponse<null>>) => {
  const files = req.files as Express.Multer.File[];
  if (!files) {
    // send error
    return res.status(400).json({
      code: 400,
      success: false,
      message: `Thêm danh sách file media thất bại`,
    });
  }

  let medias: MediaItem[] = [];
  for (let i = 0; i < files.length; i++) {
    medias.push({
      fileUrl: `http://localhost:4000/${files[i].filename}`,
      name: files[i].filename,
      mimetype: files[i].mimetype,
      size: `${Math.floor(files[i].size / 1024)} kb`,
      type: files[i].mimetype.split('/')[0] === 'image' ? 0 : 1,
      path: files[i].path,
      userId: req.userId as number,
    });
  }

  try {
    // add media
    await Media.insert(medias);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm danh sách file media thành công',
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

// delete any media
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    for (let i = 0; i < ids.length; i++) {
      // check media
      const media = await Media.findOneBy({ id: ids[i] });

      if (!media) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'File media không tồn tại',
        });
      }
    }

    const medias = await Media.findBy({ id: In(ids) });

    // delete media
    await Media.delete(ids);

    // delete file local
    for (let i = 0; i < medias.length; i++) {
      removeFile(medias[i].path);
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa file media thành công',
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
