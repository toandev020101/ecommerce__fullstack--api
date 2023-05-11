import express from 'express';
import * as shipMethodController from '../controllers/shipMethodController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import shipMethodSchema from '../validations/shipMethodSchema';
import validateYup from '../middlewares/validateYup';

const router = express.Router();

// @route GET api/v1/ship-method/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination ship method
// @access Private
router.get(
  '/pagination',
  checkAuth,
  checkPermission('/ship-method/pagination', 'get'),
  shipMethodController.getPagination,
);

// @route GET api/v1/ship-method
// @desc Get all ship method
// @access Private
router.get('', checkAuth, checkPermission('/ship-method', 'get'), shipMethodController.getAll);

// @route POST api/v1/ship-method
// @desc post ship method
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/ship-method', 'post'),
  validateYup(shipMethodSchema),
  shipMethodController.addOne,
);

// @route PUT api/v1/ship-method
// @desc put ship method
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/ship-method/:id', 'put'),
  validateYup(shipMethodSchema),
  shipMethodController.updateOne,
);

// @route DELETE api/v1/ship-method
// @desc Delete any ship method
// @access Private
router.delete('', checkAuth, checkPermission('/ship-method', 'delete'), shipMethodController.removeAny);

// @route DELETE api/v1/ship-method/:id
// @desc Delete one ship method
// @access Private
router.delete('/:id', checkAuth, checkPermission('/ship-method/:id', 'delete'), shipMethodController.removeOne);

export default router;
