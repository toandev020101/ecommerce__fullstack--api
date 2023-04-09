import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPermission } from '../middlewares/checkPermission';
import validateYup from '../middlewares/validateYup';
import tagSchema from '../validations/tagSchema';
import * as tagController from '../controllers/tagController';

const router = express.Router();

// @route GET api/v1/tag/pagination?_limit=&_page=&_sort=&_order=
// @desc Get pagination tag
// @access Private
router.get('/pagination', checkAuth, checkPermission('/tag/pagination', 'get'), tagController.getPagination);

// @route GET api/v1/tag/search
// @desc Get list tag by search term
// @access Private
router.get('/search', checkAuth, checkPermission('/tag/search', 'get'), tagController.getListBySearchTerm);

// @route GET api/v1/tag
// @desc Get all tag
// @access Private
router.get('', checkAuth, checkPermission('/tag', 'get'), tagController.getAll);

// @route GET api/v1/tag/:id
// @desc Get one tag
// @access Private
router.get('/:id', checkAuth, checkPermission('/tag/:id', 'get'), tagController.getOneById);

// @route POST api/v1/tag
// @desc post tag
// @access Private
router.post('', checkAuth, checkPermission('/tag', 'post'), validateYup(tagSchema), tagController.addOne);

// @route PUT api/v1/tag/:id
// @desc put one tag
// @access Private
router.put('/:id', checkAuth, checkPermission('/tag/:id', 'put'), validateYup(tagSchema), tagController.updateOne);

// @route DELETE api/v1/tag
// @desc Delete any tag
// @access Private
router.delete('', checkAuth, checkPermission('/tag', 'delete'), tagController.removeAny);

// @route DELETE api/v1/tag/:id
// @desc Delete one tag
// @access Private
router.delete('/:id', checkAuth, checkPermission('/tag/:id', 'delete'), tagController.removeOne);

export default router;
