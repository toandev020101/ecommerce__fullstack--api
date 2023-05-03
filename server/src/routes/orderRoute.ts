import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import orderSchema from '../validations/orderSchema';
import * as orderController from '../controllers/orderController';

const router = express.Router();

// @route GET api/v1/order/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination order
// @access Private
router.get('/pagination', checkAuth, checkPermission('/order/pagination', 'get'), orderController.getPagination);

// @route GET api/v1/order/id
// @desc Get one order
// @access Private
router.get('/:id', checkAuth, checkPermission('/order/:id', 'get'), orderController.getOne);

// @route POST api/v1/order
// @desc post order
// @access Private
router.post('', checkAuth, checkPermission('/order', 'post'), validateYup(orderSchema), orderController.addOne);

// @route PUT api/v1/order/:id
// @desc put order status
// @access Private
router.put('/:id', checkAuth, checkPermission('/order/:id', 'patch'), orderController.updateOne);

// @route PATCH api/v1/order/:id
// @desc patch order status
// @access Private
router.patch('/:id', checkAuth, checkPermission('/order/:id', 'patch'), orderController.changeStatus);

// @route DELETE api/v1/order
// @desc Delete any order
// @access Private
router.delete('', checkAuth, checkPermission('/order', 'delete'), orderController.removeAny);

// @route DELETE api/v1/order/:id
// @desc Delete one order
// @access Private
router.delete('/:id', checkAuth, checkPermission('/order/:id', 'delete'), orderController.removeOne);

export default router;
