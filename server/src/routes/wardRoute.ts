import { checkPermission } from '../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as wardController from '../controllers/wardController';

const router = express.Router();

// @route GET api/v1/ward/:districtId/search
// @desc Get list ward by districtId and search term
// @access Private
router.get(
  '/:districtId/search',
  checkAuth,
  checkPermission('/ward/:districtId/search', 'get'),
  wardController.getListByDistrictIdAndSearchTerm,
);

export default router;
