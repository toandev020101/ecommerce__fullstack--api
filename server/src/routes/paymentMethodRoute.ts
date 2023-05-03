import express from 'express';
import * as paymentMethodController from '../controllers/paymentMethodController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';

const router = express.Router();

// @route GET api/v1/payment-method
// @desc Get all payment method
// @access Private
router.get('', checkAuth, checkPermission('/payment-method', 'get'), paymentMethodController.getAll);

export default router;
