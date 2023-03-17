import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import validateYup from '../middlewares/validateYup';
import * as userController from '../controllers/userController';
import userSchema from '../validations/userSchema';
import * as yup from 'yup';

const router = express.Router();

// @route GET api/v1/user/pagination/role?_limit=&_page=&_sort=&_order=
// @desc Get pagination user and role
// @access Private
router.get('/pagination/role', checkAuth, userController.getPaginationAndRole);

// @route GET api/v1/user/role
// @desc Get all user and role
// @access Private
router.get('/role', checkAuth, userController.getAllAndRole);

// @route GET api/v1/user/:id/role
// @desc Get one user and role
// @access Private
router.get('/:id/role', checkAuth, userController.getOneAndRoleById);

// @route POST api/v1/user/any
// @desc post any user
// @access Private
router.post('/any', checkAuth, validateYup(yup.array().of(userSchema)), userController.addAny);

// @route POST api/v1/user
// @desc post user
// @access Private
router.post('', checkAuth, validateYup(userSchema), userController.addOne);

// @route PATCH api/v1/user/:id
// @desc Patch one user
// @access Private
router.patch('/:id', checkAuth, userController.updateOne);

// @route DELETE api/v1/user
// @desc Delete any user
// @access Private
router.delete('', checkAuth, userController.removeAny);

// @route DELETE api/v1/user/:id
// @desc Delete one user
// @access Private
router.delete('/:id', checkAuth, userController.removeOne);

export default router;
