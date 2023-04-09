import express from 'express';
import variationSchema from '../validations/variationSchema';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import * as variationOptionController from '../controllers/variationOptionController';

const router = express.Router();

// @route GET api/v1/variation-option/pagination/:variationId?_limit=&_page=&_sort=&_order=
// @desc Get pagination variation option by variation id
// @access Private
router.get(
  '/pagination/:variationId',
  checkAuth,
  checkPermission('/variation-option/pagination/:variationId', 'get'),
  variationOptionController.getPaginationByVariationId,
);

// @route GET api/v1/variation-option/:variationId/search
// @desc Get list variation option by search and variation id
// @access Private
router.get(
  '/:variationId/search',
  checkAuth,
  checkPermission('/variation-option/:variationId/search', 'get'),
  variationOptionController.getListBySearchTermAndVariationId,
);

// @route GET api/v1/variation-option/:variationId
// @desc Get list variation option by variation id
// @access Private
router.get(
  '/:variationId',
  checkAuth,
  checkPermission('/variation-option/:variationId', 'get'),
  variationOptionController.getListByVariationId,
);

// @route GET api/v1/variation-option/:id
// @desc Get one variation option
// @access Private
router.get('/:id', checkAuth, checkPermission('/variation-option/:id', 'get'), variationOptionController.getOneById);

// @route POST api/v1/variation-option
// @desc post variation option
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/variation-option', 'post'),
  validateYup(variationSchema),
  variationOptionController.addOne,
);

// @route PUT api/v1/variation-option/:id
// @desc put one variation option
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/variation-option/:id', 'put'),
  validateYup(variationSchema),
  variationOptionController.updateOne,
);

// @route DELETE api/v1/variation-option
// @desc Delete any variation option
// @access Private
router.delete('', checkAuth, checkPermission('/variation-option', 'delete'), variationOptionController.removeAny);

// @route DELETE api/v1/variation-option/:id
// @desc Delete one variation option
// @access Private
router.delete(
  '/:id',
  checkAuth,
  checkPermission('/variation-option/:id', 'delete'),
  variationOptionController.removeOne,
);

export default router;
