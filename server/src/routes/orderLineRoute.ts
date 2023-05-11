import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import * as orderLineController from '../controllers/orderLineController';

const router = express.Router();

// @route GET api/v1/order-line/search
// @desc Get list order-line by search term
// @access Private
router.get('/search', checkAuth, checkPermission('/order-line/search', 'get'), orderLineController.getListBySearchTerm);

export default router;
