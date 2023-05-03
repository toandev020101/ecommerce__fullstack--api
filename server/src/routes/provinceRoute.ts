import { checkPermission } from './../middlewares/checkPermission';
import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import * as provinceController from '../controllers/provinceController';

const router = express.Router();

// @route GET api/v1/province/search
// @desc Get list province by search term
// @access Private
router.get('/search', checkAuth, checkPermission('/province/search', 'get'), provinceController.getListBySearchTerm);

export default router;
