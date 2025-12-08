import express from 'express';
import authRoute from './auth.route.js';
import picRoute from './pic.route.js';

const router = express.Router();

router.use('/auth', authRoute);

router.use('/pic', picRoute);
export default router;