import express from 'express';
import validateYup from '../middlewares/validateYup';
import * as userController from '../controllers/userController';
import registerSchema from '../validations/registerSchema';
import loginSchema from '../validations/loginSchema';

const router = express.Router();

// @route POST api/v1/auth/register
// @desc Register user
// @access Public
router.post('/register', validateYup(registerSchema), userController.register);

// @route POST api/v1/auth/login
// @desc Login user
// @access Public
router.post('/login', validateYup(loginSchema), userController.login);

// @route GET api/v1/auth/refresh-token
// @desc Refresh token user
// @access private
router.get('/refresh-token', userController.refreshToken);

export default router;
