import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import { AuthResponse } from '../interfaces/AuthResponse';
import { CommonResponse } from './../interfaces/CommonResponse';
import { LoginInput } from './../interfaces/LoginInput';
import { RegisterInput } from './../interfaces/RegisterInput';
import { UserAuthPayload } from './../interfaces/UserAuthPayload';
import { Role } from './../models/Role';
import { User } from './../models/User';
import { createToken, sendRefreshToken } from './../utils/jwt';

// register user
export const register = async (req: Request<{}, {}, RegisterInput, {}>, res: Response<AuthResponse>) => {
  try {
    const { username, password } = req.body;

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
    const role = await Role.findOneBy({ code: 'customer' });
    if (!role) {
      // send error
      return res.status(500).json({
        code: 500,
        success: false,
        message: 'Lỗi server!',
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
  try {
    const { username, password } = req.body;

    // find and check username
    const user = await User.findOneBy({ username });

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
  try {
    // check refresh token
    const token = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];

    if (!token) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    // verify refresh token
    const decodedUser = verify(token, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload;

    const user = await User.findOneBy({ id: decodedUser.userId });

    if (!user) {
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

// get all user
export const getAll = async (_req: Request, res: Response<CommonResponse<User>>) => {
  try {
    // find users
    const users = await User.find();

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

// get one user
export const getOneById = async (req: Request<{}, {}, { id: number }, {}>, res: Response<CommonResponse<User>>) => {
  try {
    // find user
    const user = await User.findOneBy({ id: req.body.id });

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
