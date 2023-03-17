import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import * as roleController from '../controllers/roleController';

const router = express.Router();

// @route GET api/v1/role
// @desc Get all role
// @access Private
router.get('/', checkAuth, roleController.getAll);

// @route GET api/v1/role/:id
// @desc Get one role
// @access Private
router.get('/:id', checkAuth, roleController.getOneById);

export default router;
