import { checkPermission } from '../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as wardController from '../controllers/wardController';

const router = express.Router();

// @route GET api/v1/ward/any/:districtId
// @desc Get list ward by districtId
// @access Private
router.get(
  '/any/:districtId',
  checkAuth,
  checkPermission('/ward/any/:districtId', 'get'),
  wardController.getListByDistrictId,
);

// @route GET api/v1/ward:id
// @desc Get one ward by id
// @access Private
router.get('/:id', checkAuth, checkPermission('/ward/:id', 'get'), wardController.getOneById);

export default router;
