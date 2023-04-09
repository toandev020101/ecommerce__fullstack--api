import { checkPermission } from './../middlewares/checkPermission';
import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import * as provinceController from '../controllers/provinceController';

const router = express.Router();

// @route GET api/v1/province
// @desc Get all province
// @access Private
router.get('', checkAuth, checkPermission('/province', 'get'), provinceController.getAll);

// @route GET api/v1/province/:id
// @desc Get one province by id
// @access Private
router.get('/:id', checkAuth, checkPermission('/province/:id', 'get'), provinceController.getOneById);

export default router;
