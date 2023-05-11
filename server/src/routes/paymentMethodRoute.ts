import express from 'express';
import * as paymentMethodController from '../controllers/paymentMethodController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import paymentMethodSchema from '../validations/paymentMethodSchema';
import validateYup from '../middlewares/validateYup';

const router = express.Router();
// @route GET api/v1/payment-method/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination payment method
// @access Private
router.get(
  '/pagination',
  checkAuth,
  checkPermission('/payment-method/pagination', 'get'),
  paymentMethodController.getPagination,
);

// @route GET api/v1/payment-method
// @desc Get all payment method
// @access Private
router.get('', checkAuth, checkPermission('/payment-method', 'get'), paymentMethodController.getAll);

// @route POST api/v1/payment-method
// @desc post payment method
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/payment-method', 'post'),
  validateYup(paymentMethodSchema),
  paymentMethodController.addOne,
);

// @route PUT api/v1/payment-method
// @desc put payment method
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/payment-method/:id', 'put'),
  validateYup(paymentMethodSchema),
  paymentMethodController.updateOne,
);

// @route DELETE api/v1/payment-method
// @desc Delete any payment method
// @access Private
router.delete('', checkAuth, checkPermission('/payment-method', 'delete'), paymentMethodController.removeAny);

// @route DELETE api/v1/payment-method/:id
// @desc Delete one payment method
// @access Private
router.delete('/:id', checkAuth, checkPermission('/payment-method/:id', 'delete'), paymentMethodController.removeOne);

export default router;
