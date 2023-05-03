import express from 'express';
import * as shipMethodController from '../controllers/shipMethodController';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';

const router = express.Router();

// @route GET api/v1/ship-method
// @desc Get all ship method
// @access Private
router.get('', checkAuth, checkPermission('/ship-method', 'get'), shipMethodController.getAll);

export default router;
