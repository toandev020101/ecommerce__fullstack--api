import { checkPermission } from './../middlewares/checkPermission';
import { checkAuth } from './../middlewares/checkAuth';
import express from 'express';
import * as mediaController from '../controllers/mediaController';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './uploads');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = function (_req: any, file: any, cb: any) {
  if (file.mimetype.startsWith('image/') | file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// @route GET api/v1/media/pagination/user
// @desc get pagination media and user
// @access Private
router.get(
  '/pagination/user',
  checkAuth,
  checkPermission('/media/pagination/user', 'get'),
  mediaController.getPaginationAndUser,
);

// @route GET api/v1/media/date
// @desc get all date
// @access Private
router.get('/date', checkAuth, checkPermission('/media/date', 'get'), mediaController.getAllDate);

// @route POST api/v1/media/any
// @desc Post all media
// @access Private
router.post('/any', checkAuth, checkPermission('/media/any', 'post'), upload.array('files'), mediaController.addAny);

// @route Delete api/v1/media
// @desc Delete any media
// @access Private
router.delete('', checkAuth, checkPermission('/media', 'delete'), mediaController.removeAny);

export default router;
