import { checkPermission } from '../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as districtController from '../controllers/districtController';

const router = express.Router();

// @route GET api/v1/district/any/:provinceId
// @desc Get list district by provinceId
// @access Private
router.get(
  '/any/:provinceId',
  checkAuth,
  checkPermission('/district/any/:provinceId', 'get'),
  districtController.getListByProvinceId,
);

// @route GET api/v1/district/:id
// @desc Get one district by id
// @access Private
router.get('/:id', checkAuth, checkPermission('/district/:id', 'get'), districtController.getOneById);

export default router;
