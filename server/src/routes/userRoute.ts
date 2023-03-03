import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// @route GET api/v1/user
// @desc Get all user
// @access Private
router.get('/', userController.getAll);

// @route GET api/v1/user/:id
// @desc Get one user
// @access Private
router.get('/:id', userController.getOneById);

export default router;
