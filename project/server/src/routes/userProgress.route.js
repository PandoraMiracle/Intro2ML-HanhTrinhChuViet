import express from 'express';
import * as userProgressController from '../controllers/userProgress.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middlewares.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user progress
router.get('/', userProgressController.getUserProgress);

// Add lesson progress
router.post('/lesson', userProgressController.addLessonProgress);

// Update user progress (full update)
router.put('/', userProgressController.updateUserProgress);

// Check if lesson is completed
router.get('/lesson/check', userProgressController.checkLessonCompleted);

// Get topic progress
router.get('/topic', userProgressController.getTopicProgress);

export default router;

