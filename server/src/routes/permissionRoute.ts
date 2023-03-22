import { checkPermission } from './../middlewares/checkPermission';
import { checkAuth } from '../middlewares/checkAuth';
import express from 'express';
import * as permissionController from '../controllers/permissionController';
import validateYup from '../middlewares/validateYup';
import permissionSchema from '../validations/permissionSchema';

const router = express.Router();

// @route GET api/v1/permission
// @desc get all permission
// @access Private
router.get('', checkAuth, checkPermission('/permission', 'get'), permissionController.getAll);

// @route GET api/v1/permission/pagination/role
// @desc get pagination permission and role
// @access Private
router.get(
  '/pagination/role',
  checkAuth,
  checkPermission('/permission/pagination/role', 'get'),
  permissionController.getPaginationAndRole,
);

// @route POST api/v1/permission
// @desc post permission
// @access Private
router.post(
  '',
  checkAuth,
  checkPermission('/permission', 'post'),
  validateYup(permissionSchema),
  permissionController.addOne,
);

// @route PUT api/v1/permission/:id
// @desc put one permission
// @access Private
router.put('/:id', checkAuth, checkPermission('/permission/:id', 'put'), permissionController.updateOne);

// @route DELETE api/v1/permission
// @desc Delete any permission
// @access Private
router.delete('', checkAuth, checkPermission('/permission', 'delete'), permissionController.removeAny);

// @route DELETE api/v1/permission/:id
// @desc Delete one permission
// @access Private
router.delete('/:id', checkAuth, checkPermission('/permission/:id', 'delete'), permissionController.removeOne);

export default router;
