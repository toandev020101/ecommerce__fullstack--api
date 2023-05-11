import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import * as yup from 'yup';
import productSchema from '../validations/productSchema';
import * as productController from '../controllers/productController';

const router = express.Router();

// @route GET api/v1/product/pagination/public?_limit=&_page=&_sort=&_order=
// @desc Get pagination product by category slug
// @access Public
router.get('/pagination/public', productController.getPaginationByCategorySlugPublic);

// @route GET api/v1/product/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination product
// @access Private
router.get('/pagination', checkAuth, checkPermission('/product/pagination', 'get'), productController.getPagination);

// @route GET api/v1/product/search
// @desc Get list product by search term
// @access Private
router.get('/search', productController.getListBySearchTerm);

// @route GET api/v1/product/ids
// @desc Get list product by ids
// @access Private
router.get('/ids', checkAuth, checkPermission('/product/ids', 'get'), productController.getListByIds);

// @route GET api/v1/product/public
// @desc Get all product
// @access Public
router.get('/public', productController.getAll);

// @route GET api/v1/product
// @desc Get all product
// @access Private
router.get('', checkAuth, checkPermission('/product', 'get'), productController.getAll);

// @route GET api/v1/product/:slug/public
// @desc Get one product
// @access Public
router.get('/:slug/public', productController.getOneBySlugPublic);

// @route GET api/v1/product/:id
// @desc Get one product
// @access Private
router.get('/:id', checkAuth, checkPermission('/product/:id', 'get'), productController.getOneById);

// @route POST api/v1/product/any
// @desc post any product
// @access Private
router.post(
  '/any',
  checkAuth,
  checkPermission('/product/any', 'post'),
  validateYup(yup.array().of(productSchema)),
  productController.addAny,
);

// @route POST api/v1/product
// @desc post product
// @access Private
router.post('', checkAuth, checkPermission('/product', 'post'), validateYup(productSchema), productController.addOne);

// @route PUT api/v1/product/:id
// @desc put one product
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/product/:id', 'put'),
  validateYup(productSchema),
  productController.updateOne,
);

// @route PATCH api/v1/user/:id
// @desc Patch one user (isActive, ...)
// @access Private
router.patch('/:id', checkAuth, checkPermission('/product/:id', 'patch'), productController.changeAttribute);

// @route DELETE api/v1/product
// @desc Delete any product
// @access Private
router.delete('', checkAuth, checkPermission('/product', 'delete'), productController.removeAny);

// @route DELETE api/v1/product/:id
// @desc Delete one product
// @access Private
router.delete('/:id', checkAuth, checkPermission('/product/:id', 'delete'), productController.removeOne);

export default router;
