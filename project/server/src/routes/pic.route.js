import express from 'express';
import multer from 'multer';

import * as picController from '../controllers/pic.controller.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('image'), picController.uploadPic);
router.post('/recognize', upload.single('image'), picController.recognize);

export default router;