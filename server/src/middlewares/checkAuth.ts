import { NextFunction, Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import { BaseResponse } from './../interfaces/BaseResponse';
import { UserAuthPayload } from './../interfaces/UserAuthPayload';

export const checkAuth = (req: Request<any, any, any, any>, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    // authHeader here is "Bearer accessToken"
    const accessToken = req.headers.authorization?.split(' ')[1];

    // check access token
    if (!accessToken)
      return res.status(401).json({
        code: 401,
        success: false,
        message: 'Token không hợp lệ!',
      });

    // verify access token
    const decodedUser = verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload;

    if (!decodedUser)
      return res.status(401).json({
        code: 401,
        success: false,
        message: 'Token không hợp lệ!',
      });

    req.userId = decodedUser.userId;

    return next();
  } catch (error) {
    // send error
    return res.status(500).json({
      code: 500,
      success: false,
      message: `Lỗi server :: ${error.message}`,
    });
  }
};
