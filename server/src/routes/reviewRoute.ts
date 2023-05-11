import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import reviewSchema from '../validations/reviewSchema';
import * as reviewController from '../controllers/reviewController';

const router = express.Router();

// @route GET api/v1/review/pagination/:productId?_limit=&_page=&_sort=&_order=
// @desc Get pagination review
// @access Private
router.get('/pagination/:productId', reviewController.getPaginationByProductId);

// @route GET api/v1/review/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination review
// @access Private
router.get('/pagination', checkAuth, checkPermission('/review/pagination', 'get'), reviewController.getPagination);

// @route GET api/v1/review/product/:productId
// @desc Get list review
// @access Public
router.get('/product/:productId', reviewController.getListByProductId);

// @route GET api/v1/review/order-line/:orderLinedId
// @desc Get one review
// @access Private
router.get(
  '/order-line/:orderLinedId',
  checkAuth,
  checkPermission('/review/order-line/:orderLinedId', 'get'),
  reviewController.getOneByOrderLinedId,
);

// @route GET api/v1/review/:orderLinedId
// @desc Get one review
// @access Private
router.get('/:id', checkAuth, checkPermission('/review/:id', 'get'), reviewController.getOneById);

// @route POST api/v1/review
// @desc post review
// @access Private
router.post('', checkAuth, checkPermission('/review', 'post'), validateYup(reviewSchema), reviewController.addOne);

// @route PATCH api/v1/review/:id
// @desc patch one review status
// @access Private
router.patch('/:id', checkAuth, checkPermission('/review/:id', 'patch'), reviewController.changeStatus);

// @route PUT api/v1/review/:id
// @desc put one review
// @access Private
router.put(
  '/:id',
  checkAuth,
  checkPermission('/review/:id', 'put'),
  validateYup(reviewSchema),
  reviewController.updateOne,
);

// @route DELETE api/v1/review
// @desc Delete any review
// @access Private
router.delete('', checkAuth, checkPermission('/review', 'delete'), reviewController.removeAny);

// @route DELETE api/v1/review/:id
// @desc Delete one review
// @access Private
router.delete('/:id', checkAuth, checkPermission('/review/:id', 'delete'), reviewController.removeOne);

export default router;
