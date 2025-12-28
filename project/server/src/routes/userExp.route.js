import express from 'express';
import * as userExpController from '../controllers/userExp.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middlewares.js';

const router = express.Router();

// Get leaderboard (public, no auth needed)
router.get('/leaderboard', userExpController.getLeaderboard);

// All other routes require authentication
router.use(verifyToken);

// Get user exp
router.get('/', userExpController.getUserExp);

// Add exp points
router.post('/add', userExpController.addExp);

// Update user exp (full update)
router.put('/', userExpController.updateUserExp);

// Update streak
router.post('/streak', userExpController.updateStreak);

export default router;

