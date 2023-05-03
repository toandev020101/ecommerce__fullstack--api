import { checkPermission } from '../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as orderStatusController from '../controllers/orderStatusController';

const router = express.Router();

// @route GET api/v1/order-status
// @desc Get all order status
// @access Private
router.get('', checkAuth, checkPermission('/order-status', 'get'), orderStatusController.getAll);

export default router;
