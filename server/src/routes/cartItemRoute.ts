import express from 'express';
import cartItemSchema from '../validations/cartItemSchema';
import * as cartItemController from '../controllers/cartItemController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import * as yup from 'yup';

const router = express.Router();

// @route GET api/v1/cart-item
// @desc Get all cart item
// @access Private
router.get('', checkAuth, checkPermission('/cart-item', 'get'), cartItemController.getAll);

// @route POST api/v1/cart-item/any
// @desc post cart item any
// @access Private
router.post(
  '/any',
  checkAuth,
  checkPermission('/cart-item/any', 'post'),
  validateYup(yup.array().of(cartItemSchema)),
  cartItemController.addAny,
);

// @route POST api/v1/cart-item
// @desc post cart item
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/cart-item', 'post'),
  validateYup(cartItemSchema),
  cartItemController.addOne,
);

// @route PATCH api/v1/cart-item/:id/product-item
// @desc Patch one cartItem (variation, ...)
// @access Private
router.patch(
  '/:id/product-item',
  checkAuth,
  checkPermission('/cart-item/:id/product-item', 'patch'),
  cartItemController.changeProductItem,
);

// @route PATCH api/v1/cart-item/:id/quantity
// @desc Patch one cartItem (variation, ...)
// @access Private
router.patch(
  '/:id/quantity',
  checkAuth,
  checkPermission('/cart-item/:id/quantity', 'patch'),
  cartItemController.changeQuantity,
);

// @route DELETE api/v1/cart-item
// @desc Delete any cartItem
// @access Private
router.delete('', checkAuth, checkPermission('/cart-item', 'delete'), cartItemController.removeAny);

// @route DELETE api/v1/cart-item/:id
// @desc Delete one cartItem
// @access Private
router.delete('/:id', checkAuth, checkPermission('/cart-item/:id', 'delete'), cartItemController.removeOne);

export default router;
