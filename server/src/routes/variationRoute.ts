import express from 'express';
import variationSchema from '../validations/variationSchema';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import * as variationController from '../controllers/variationController';

const router = express.Router();

// @route GET api/v1/variation/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination variation
// @access Private
router.get(
  '/pagination',
  checkAuth,
  checkPermission('/variation/pagination', 'get'),
  variationController.getPagination,
);

// @route GET api/v1/variation/any/public
// @desc Get list variation by category slug
// @access Public
router.get('/any/public', variationController.getListByCategorySlugPublic);

// @route GET api/v1/variation
// @desc Get all variation
// @access Private
router.get('', checkAuth, checkPermission('/variation', 'get'), variationController.getAll);

// @route GET api/v1/variation/:id
// @desc Get one variation
// @access Private
router.get('/:id', checkAuth, checkPermission('/variation/:id', 'get'), variationController.getOneById);

// @route POST api/v1/variation
// @desc post variation
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/variation', 'post'),
  validateYup(variationSchema),
  variationController.addOne,
);

// @route PUT api/v1/variation/:id
// @desc put one variation
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/variation/:id', 'put'),
  validateYup(variationSchema),
  variationController.updateOne,
);

// @route DELETE api/v1/variation
// @desc Delete any variation
// @access Private
router.delete('', checkAuth, checkPermission('/variation', 'delete'), variationController.removeAny);

// @route DELETE api/v1/variation/:id
// @desc Delete one variation
// @access Private
router.delete('/:id', checkAuth, checkPermission('/variation/:id', 'delete'), variationController.removeOne);

export default router;
