import { checkPermission } from '../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as districtController from '../controllers/districtController';

const router = express.Router();

// @route GET api/v1/district/:provinceId/search
// @desc Get list district by provinceId
// @access Private
router.get(
  '/:provinceId/search',
  checkAuth,
  checkPermission('/district/:provinceId/search', 'get'),
  districtController.getListByProvinceIdAndSearchTerm,
);

export default router;
