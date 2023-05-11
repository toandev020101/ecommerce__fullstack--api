import express from 'express';
import * as couponController from '../controllers/couponController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import couponSchema from '../validations/couponSchema';

const router = express.Router();

// @route GET api/v1/coupon
// @desc get all coupon
// @access Public
router.get('', couponController.getAllPublic);

// @route GET api/v1/coupon/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination coupon
// @access Private
router.get('/pagination', checkAuth, checkPermission('/coupon/pagination', 'get'), couponController.getPagination);

// @route GET api/v1/coupon/:code
// @desc get coupon
// @access Private
router.get('/:code', checkAuth, checkPermission('/coupon/:code', 'get'), couponController.checkOne);

// @route POST api/v1/coupon
// @desc post coupon
// @access Private
router.post('', checkAuth, checkPermission('/coupon', 'post'), validateYup(couponSchema), couponController.addOne);

// @route PUT api/v1/coupon
// @desc put coupon
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/coupon/:id', 'put'),
  validateYup(couponSchema),
  couponController.updateOne,
);

// @route DELETE api/v1/coupon
// @desc Delete any coupon
// @access Private
router.delete('', checkAuth, checkPermission('/coupon', 'delete'), couponController.removeAny);

// @route DELETE api/v1/coupon/:id
// @desc Delete one coupon
// @access Private
router.delete('/:id', checkAuth, checkPermission('/coupon/:id', 'delete'), couponController.removeOne);

export default router;
