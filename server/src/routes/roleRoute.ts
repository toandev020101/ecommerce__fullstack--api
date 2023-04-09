import { checkPermission } from './../middlewares/checkPermission';
import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import * as roleController from '../controllers/roleController';
import validateYup from '../middlewares/validateYup';
import roleSchema from '../validations/roleSchema';

const router = express.Router();

// @route GET api/v1/role
// @desc Get all role
// @access Private
router.get('', checkAuth, checkPermission('/role', 'get'), roleController.getAll);

// @route GET api/v1/role/user
// @desc Get all role and user
// @access Private
router.get('/user', checkAuth, checkPermission('/role/user', 'get'), roleController.getAllAndUser);

// @route GET api/v1/role/permission
// @desc Get one role and permission
// @access Private
router.get(
  '/:id/permission',
  checkAuth,
  checkPermission('/role/:id/permission', 'get'),
  roleController.getOneAndPermissionById,
);

// @route POST api/v1/role
// @desc Post one role
// @access Private
router.post('', checkAuth, checkPermission('/role', 'post'), validateYup(roleSchema), roleController.addOne);

// @route PUT api/v1/role/:id
// @desc put one role
// @access Private
router.put('/:id', checkAuth, checkPermission('/role/:id', 'put'), validateYup(roleSchema), roleController.updateOne);

// @route DELETE api/v1/role/:id
// @desc Delete one role
// @access Private
router.delete('/:id', checkAuth, checkPermission('/role/:id', 'delete'), roleController.removeOne);

export default router;
