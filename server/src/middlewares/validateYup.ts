import { FieldError } from './../interfaces/FieldError';
import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from '../interfaces/BaseResponse';

const validateYup = (schema: any) => async (req: Request, res: Response<void | BaseResponse>, next: NextFunction) => {
  const body = req.body;

  try {
    await schema.validate(body, { abortEarly: false });
    return next();
  } catch (error) {
    let errors: FieldError[] = [];
    
    error.inner.forEach((err: any) => {
      errors = [...errors, { field: err.path, message: err.message }];
    });

    return res.status(400).json({
      code: 400,
      success: false,
      message: 'Yêu cầu bị từ chối!',
      errors,
    });
  }
};

export default validateYup;
