import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import orderSchema from '../validations/orderSchema';
import * as couponController from '../controllers/couponController';

const router = express.Router();

// @route GET api/v1/coupon/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination coupon
// @access Private
router.get('/pagination', checkAuth, checkPermission('/coupon/pagination', 'get'), couponController.getPagination);

// @route GET api/v1/coupon
// @desc get coupon
// @access Private
router.get('', checkAuth, checkPermission('/coupon', 'get'), couponController.checkOne);

// @route POST api/v1/coupon
// @desc post coupon
// @access Private
router.post('', checkAuth, checkPermission('/coupon', 'post'), validateYup(orderSchema), couponController.addOne);

// @route DELETE api/v1/coupon
// @desc Delete any coupon
// @access Private
router.delete('', checkAuth, checkPermission('/coupon', 'delete'), couponController.removeAny);

// @route DELETE api/v1/coupon/:id
// @desc Delete one coupon
// @access Private
router.delete('/:id', checkAuth, checkPermission('/coupon/:id', 'delete'), couponController.removeOne);

export default router;
