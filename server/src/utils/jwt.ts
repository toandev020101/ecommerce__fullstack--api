import { Response } from 'express';
import { User } from './../models/User';
import { Secret, sign } from 'jsonwebtoken';

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
  sign(
    { userId: user.id, ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {}) },
    type === 'accessToken' ? (process.env.ACCESS_TOKEN_SECRET as Secret) : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === 'accessToken' ? '15m' : '1h',
    },
  );

export const sendRefreshToken = (res: Response, user: User) => {
  const refreshToken = createToken('refreshToken', user);
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/api/v1/auth/refresh-token',
  });
};
