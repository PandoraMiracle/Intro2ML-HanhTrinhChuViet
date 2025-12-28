import express from 'express';
import authRoute from './auth.route.js';
import picRoute from './pic.route.js';
import userExpRoute from './userExp.route.js';
import userProgressRoute from './userProgress.route.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/pic', picRoute);
router.use('/userExp', userExpRoute);
router.use('/userProgress', userProgressRoute);

export default router;