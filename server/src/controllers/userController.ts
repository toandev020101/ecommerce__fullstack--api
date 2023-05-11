import { Media } from './../models/Media';
import { OrderCoupon } from './../models/OrderCoupon';
import { ReviewImage } from './../models/ReviewImage';
import { Review } from './../models/Review';
import { OrderLine } from './../models/OrderLine';
import { Order } from './../models/Order';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import { Brackets, In } from 'typeorm';
import AppDataSource from '../AppDataSource';
import { AuthResponse } from '../interfaces/AuthResponse';
import { FieldError } from './../interfaces/FieldError';
import { LoginInput } from './../interfaces/LoginInput';
import { RegisterInput } from './../interfaces/RegisterInput';
import { UserAuthPayload } from './../interfaces/UserAuthPayload';
import { UserInput } from './../interfaces/UserInput';
import { CommonResponse, ListParams } from './../interfaces/common';
import { Role } from './../models/Role';
import { User } from './../models/User';
import { createToken, sendRefreshToken } from './../utils/jwt';
import { ChangePasswordInput } from '../interfaces/ChangePasswordInput';

// register user
export const register = async (req: Request<{}, {}, RegisterInput, {}>, res: Response<AuthResponse>) => {
  const { username, password } = req.body;

  try {
    // find and check username
    const user = await User.findOneBy({ username });

    if (user) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng ký thất bại',
        errors: [{ field: 'username', message: 'Tên tài khoản đã tồn tại!' }],
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // default role id
    const role = await Role.findOneBy({ name: 'Khách hàng' });
    if (!role) {
      // send error
      return res.status(500).json({
        code: 500,
        success: false,
        message: 'Lỗi server :: chưa có vai trò khách hàng!',
      });
    }

    // create user
    const newUser = User.create({
      ...req.body,
      password: hashedPassword,
      roleId: role.id,
    });

    await newUser.save();

    // hide password
    newUser.password = '';

    // send refresh token
    sendRefreshToken(res, newUser);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Đăng ký thành công',
      data: newUser,
      accessToken: createToken('accessToken', newUser),
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

// login user
export const login = async (req: Request<{}, {}, LoginInput, {}>, res: Response<AuthResponse>) => {
  const { username, password } = req.body;

  try {
    // find and check username
    const user = await User.findOne({
      where: { username },
      select: ['id', 'fullName', 'username', 'password', 'avatar', 'gender', 'email', 'isActive', 'tokenVersion'],
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng nhập thất bại',
        errors: [
          { field: 'username', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
          { field: 'password', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
        ],
      });
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng nhập thất bại',
        errors: [
          { field: 'username', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
          { field: 'password', message: 'Tài khoản hoặc mật khẩu không chính xác!' },
        ],
      });
    }

    // check active user
    if (!user.isActive) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng nhập thất bại',
        errors: [
          { field: 'username', message: 'Tài khoản đã bị khóa!' },
          { field: 'password', message: 'Tài khoản đã bị khóa!' },
        ],
      });
    }

    // hide password
    user.password = '';

    // send refresh token
    sendRefreshToken(res, user);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Đăng nhập thành công',
      data: user,
      accessToken: createToken('accessToken', user),
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

// refresh token user
export const refreshToken = async (req: Request, res: Response<AuthResponse>) => {
  // check refresh token
  const token = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];

  if (!token) {
    return res.status(403).json({
      code: 403,
      success: false,
      message: 'Không có quyền truy cập',
    });
  }

  try {
    // verify refresh token
    const decodedUser = verify(token, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload;
    const user = await User.findOneBy({ id: decodedUser.userId });

    if (!user || user.tokenVersion !== decodedUser.tokenVersion) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    // send refresh token
    sendRefreshToken(res, user);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Làm mới token thành công',
      accessToken: createToken('accessToken', user),
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

// logout user
export const logout = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<AuthResponse>) => {
  const { id } = req.params;

  try {
    // find user
    const user = await User.findOneBy({ id });

    if (!user) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng xuất thất bại',
      });
    }

    // logout
    user.tokenVersion += 1;

    await user.save();

    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/api/v1/auth/refresh-token',
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Đăng xuất thành công',
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

// get pagination user and role
export const getPaginationAndRole = async (
  req: Request<{}, {}, {}, ListParams>,
  res: Response<CommonResponse<User>>,
) => {
  const { _limit, _page, _sort, _order, roleId, gender, isActive, searchTerm } = req.query;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const queryBuilder = userRepository.createQueryBuilder('user');

    // find users
    queryBuilder.select([
      'user.id',
      'user.fullName',
      'user.username',
      'user.avatar',
      'user.gender',
      'user.email',
      'user.isActive',
      'role.id',
      'role.name',
    ]);

    queryBuilder.leftJoin('user.role', 'role');

    if (roleId && roleId !== '') {
      queryBuilder.andWhere(`user.roleId = ${roleId}`);
    }

    if (gender && gender !== '') {
      queryBuilder.andWhere(`user.gender = ${gender}`);
    }

    if (isActive && isActive !== '') {
      queryBuilder.andWhere(`user.isActive = ${isActive === '1'}`);
    }

    if (searchTerm && searchTerm !== '') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`user.fullName like '%${searchTerm}%'`)
            .orWhere(`user.username like '%${searchTerm}%'`)
            .orWhere(`user.email like '%${searchTerm}%'`);
        }),
      );
    }

    if (_limit && _page) {
      queryBuilder.skip(_page * _limit);
      queryBuilder.take(_limit);
    }

    if (_sort && _order) {
      queryBuilder.orderBy(_sort === 'role' ? 'role.name' : `user.${_sort}`, _order.toUpperCase() as 'ASC' | 'DESC');
    }

    const users = await queryBuilder.getMany();

    const total = await queryBuilder.getCount();

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy danh sách tài khoản thành công',
      data: users,
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

// get all user and role
export const getAllAndRole = async (_req: Request, res: Response<CommonResponse<User>>) => {
  try {
    // find all user
    const users = await User.find({
      relations: {
        role: true,
        ward: true,
        district: true,
        province: true,
      },
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tất cả tài khoản thành công',
      data: users,
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

// get one user and role
export const getOneAndRoleByIdPublic = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<User>>,
) => {
  const { id } = req.params;
  try {
    // find user
    const user = await User.findOne({
      where: { id },
      relations: {
        role: true,
        ward: true,
        district: true,
        province: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại!',
      });
    }

    // check active user
    if (!user.isActive) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Đăng nhập thất bại',
        errors: [
          { field: 'username', message: 'Tài khoản đã bị khóa!' },
          { field: 'password', message: 'Tài khoản đã bị khóa!' },
        ],
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tài khoản thành công',
      data: user,
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

// get one user and role
export const getOneAndRoleById = async (
  req: Request<{ id: number }, {}, {}, {}>,
  res: Response<CommonResponse<User>>,
) => {
  const { id } = req.params;
  try {
    // find user
    const user = await User.findOne({
      where: { id },
      relations: {
        role: true,
        ward: true,
        district: true,
        province: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại!',
      });
    }

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Lấy tài khoản thành công',
      data: user,
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
export const addAny = async (req: Request<{}, {}, UserInput[], {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;

  try {
    for (let i = 0; i < data.length; i++) {
      // check user
      const { username, email, password } = data[i];

      const user = await User.findOne({ where: [{ username }, { email }] });

      if (user) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: 'Tên đăng nhập hoặc email đã tồn tại!',
        });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      data[i].password = hashedPassword;
    }

    // add user
    await User.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm danh sách tài khoản thành công',
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

// add user
export const addOne = async (req: Request<{}, {}, UserInput, {}>, res: Response<CommonResponse<null>>) => {
  const data = req.body;
  const { username, email, password } = data;
  const errors: FieldError[] = [];

  try {
    // check user
    let user = await User.findOne({ where: { username } });

    if (user) {
      errors.push({ field: 'username', message: 'Tên đăng nhập đã tồn tại!' });
    }

    if (email) {
      user = await User.findOne({ where: { email } });

      if (user) {
        errors.push({ field: 'email', message: 'Email đã tồn tại!' });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Thêm tài khoản thất bại',
        errors,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    data.password = hashedPassword;

    // add user
    await User.insert(data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thêm tài khoản thành công',
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

// update one user
export const updateOne = async (
  req: Request<{ id: number }, {}, UserInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check user
    let user = await User.findOneBy({ id });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại!',
      });
    }

    // check user
    if (data.email && data.email !== '') {
      user = await User.findOneBy({ email: data.email });

      if (user) {
        return res.status(400).json({
          code: 400,
          success: false,
          message: 'Email đã tồn tại!',
          errors: [{ field: 'email', message: 'Email đã tồn tại!' }],
        });
      }
    }

    // update user
    await User.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật tài khoản thành công',
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

// update active one user
export const changeActive = async (
  req: Request<{ id: number }, {}, UserInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // check user
    let user = await User.findOneBy({ id });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại!',
      });
    }

    // update user
    await User.update(id, data);

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Cập nhật tài khoản thành công',
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

// update password one user
export const changePassword = async (
  req: Request<{ id: number }, {}, ChangePasswordInput, {}>,
  res: Response<CommonResponse<null>>,
) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;

  try {
    // check user
    let user = await User.findOne({
      select: {
        username: true,
        password: true,
      },
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại!',
      });
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Thay đổi mật khẩu thất bại',
        errors: [{ field: 'password', message: 'Mật khẩu không chính xác!' }],
      });
    }

    if (password === newPassword) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Thay đổi mật khẩu thất bại',
        errors: [
          { field: 'newPassword', message: 'Không thể nhập mật khẩu hiện tại!' },
          { field: 'confirmNewPassword', message: 'Không thể nhập mật khẩu hiện tại!' },
        ],
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // update user
    await User.update(id, { password: hashedPassword });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Thay đổi mật khẩu thành công',
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

// delete any user
export const removeAny = async (req: Request<{}, {}, { ids: number[] }, {}>, res: Response<CommonResponse<null>>) => {
  const { ids } = req.body;
  try {
    let avatars: string[] = [];

    for (let i = 0; i < ids.length; i++) {
      // check user
      const user = await User.findOneBy({ id: ids[i] });

      if (!user) {
        return res.status(404).json({
          code: 404,
          success: false,
          message: 'Tài khoản không tồn tại!',
        });
      }

      if (user.avatar) {
        avatars.push(user.avatar);
      }
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const orderRemoves = await Order.findBy({ userId: In(ids) });
      const orderRemoveIds = orderRemoves.map((orderRemove) => orderRemove.id);

      // get order line removes
      const orderLineRemoves = await OrderLine.findBy({ orderId: In(orderRemoveIds) });
      const orderLineRemoveIds = orderLineRemoves.map((orderLineRemove) => orderLineRemove.id);

      const reviewRemoves = await Review.findBy({ orderLinedId: In(orderLineRemoveIds) });
      const reviewRemoveIds = reviewRemoves.map((reviewRemove) => reviewRemove.id);

      // delete old reply
      await transactionalEntityManager.delete(Review, { reviewId: In(reviewRemoveIds) });

      // delete old review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: In(reviewRemoveIds) });

      // delete old review
      await transactionalEntityManager.delete(Review, { id: In(reviewRemoveIds) });

      // delete order line
      await transactionalEntityManager.delete(OrderLine, { orderId: In(orderRemoveIds) });
      // delete order coupon
      await transactionalEntityManager.delete(OrderCoupon, { orderId: In(orderRemoveIds) });
      // delete order
      await transactionalEntityManager.delete(Order, { id: In(orderRemoveIds) });

      // delete media
      await transactionalEntityManager.delete(Media, { userId: In(ids) });

      // delete user
      await transactionalEntityManager.delete(User, { id: In(ids) });
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa danh sách tài khoản thành công',
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

// delete one user
export const removeOne = async (req: Request<{ id: number }, {}, {}, {}>, res: Response<CommonResponse<null>>) => {
  const { id } = req.params;
  try {
    // check user
    const user = await User.findOneBy({ id });

    if (!user) {
      return res.status(404).json({
        code: 404,
        success: false,
        message: 'Tài khoản không tồn tại',
      });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const orderRemoves = await Order.findBy({ userId: id });
      const orderRemoveIds = orderRemoves.map((orderRemove) => orderRemove.id);

      // get order line removes
      const orderLineRemoves = await OrderLine.findBy({ orderId: In(orderRemoveIds) });
      const orderLineRemoveIds = orderLineRemoves.map((orderLineRemove) => orderLineRemove.id);

      const reviewRemoves = await Review.findBy({ orderLinedId: In(orderLineRemoveIds) });
      const reviewRemoveIds = reviewRemoves.map((reviewRemove) => reviewRemove.id);

      // delete old reply
      await transactionalEntityManager.delete(Review, { reviewId: In(reviewRemoveIds) });

      // delete old review image
      await transactionalEntityManager.delete(ReviewImage, { reviewId: In(reviewRemoveIds) });

      // delete old review
      await transactionalEntityManager.delete(Review, { id: In(reviewRemoveIds) });

      // delete order line
      await transactionalEntityManager.delete(OrderLine, { orderId: In(orderRemoveIds) });
      // delete order coupon
      await transactionalEntityManager.delete(OrderCoupon, { orderId: In(orderRemoveIds) });
      // delete order
      await transactionalEntityManager.delete(Order, { id: In(orderRemoveIds) });

      // delete media
      await transactionalEntityManager.delete(Media, { userId: id });

      // delete user
      await transactionalEntityManager.delete(User, { id });
    });

    // send results
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Xóa tài khoản thành công',
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
