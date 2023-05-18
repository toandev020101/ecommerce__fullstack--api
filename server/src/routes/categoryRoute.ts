import express from 'express';
import categorySchema from '../validations/categorySchema';
import * as categoryController from '../controllers/categoryController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';

const router = express.Router();

// @route GET api/v1/category/pagination/parent?_limit=&_page=&_sort=&_order=
// @desc Get pagination category and parent
// @access Private
router.get(
  '/pagination/parent',
  checkAuth,
  checkPermission('/category/pagination/parent', 'get'),
  categoryController.getPaginationAndParent,
);

// @route GET api/v1/category/any/public
// @desc Get list category by parent slug
// @access Public
router.get('/any/public', categoryController.getListByParentSlugPublic);

// @route GET api/v1/category/search
// @desc Get list category by search term
// @access Private
router.get('/search', checkAuth, checkPermission('/category/search', 'get'), categoryController.getListBySearchTerm);

// @route GET api/v1/category/public
// @desc Get all category
// @access Public
router.get('/public', categoryController.getAllPublic);

// @route GET api/v1/category
// @desc Get all category
// @access Private
router.get('', checkAuth, checkPermission('/category', 'get'), categoryController.getAll);

// @route GET api/v1/category/:id/parent
// @desc Get one category and parent
// @access Private
router.get(
  '/:id/parent',
  checkAuth,
  checkPermission('/category/:id/parent', 'get'),
  categoryController.getOneAndParentById,
);

// @route POST api/v1/category
// @desc post category
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/category', 'post'),
  validateYup(categorySchema),
  categoryController.addOne,
);

// @route PUT api/v1/category/:id
// @desc put one category
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/category/:id', 'put'),
  validateYup(categorySchema),
  categoryController.updateOne,
);

// @route PATCH api/v1/category/:id
// @desc Patch one category (isActive, ...)
// @access Private
router.patch('/:id', checkAuth, checkPermission('/category/:id', 'patch'), categoryController.changeActive);

// @route DELETE api/v1/category
// @desc Delete any category
// @access Private
router.delete('', checkAuth, checkPermission('/category', 'delete'), categoryController.removeAny);

// @route DELETE api/v1/category/:id
// @desc Delete one category
// @access Private
router.delete('/:id', checkAuth, checkPermission('/category/:id', 'delete'), categoryController.removeOne);

export default router;
