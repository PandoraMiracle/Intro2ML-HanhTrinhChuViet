import UserProgress from '../models/userProgress.model.js';
import UserExp from '../models/userExp.model.js';

// Get user progress
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;
    
    let userProgress = await UserProgress.findOne({ userId });
    
    // Create if doesn't exist
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
      await userProgress.save();
    }
    
    res.status(200).json({
      success: true,
      data: userProgress
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Add lesson progress
export const addLessonProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicId, lessonId, score } = req.body;
    
    if (!topicId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu topicId hoặc lessonId'
      });
    }
    
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    // Check if already completed
    const wasCompleted = userProgress.isLessonCompleted(topicId, lessonId);
    
    // Add or update lesson progress
    await userProgress.addLessonProgress(topicId, lessonId, score || 0);
    
    // Update current topic/lesson if needed
    if (topicId > userProgress.currentTopic || 
        (topicId === userProgress.currentTopic && lessonId > userProgress.currentLesson)) {
      userProgress.currentTopic = topicId;
      userProgress.currentLesson = lessonId;
    }
    
    // Check if should unlock next topic
    await userProgress.checkTopicCompletion(topicId);
    
    await userProgress.save();
    
    // Update totalLessonsCompleted in userExp if this is a new completion
    if (!wasCompleted) {
      try {
        let userExp = await UserExp.findOne({ userId });
        if (userExp) {
          userExp.totalLessonsCompleted += 1;
          await userExp.save();
        }
      } catch (expErr) {
        console.error('Error updating totalLessonsCompleted:', expErr);
        // Continue even if this fails
      }
    }
    
    res.status(200).json({
      success: true,
      message: wasCompleted ? 'Đã cập nhật tiến độ bài học' : 'Đã hoàn thành bài học',
      data: userProgress
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update user progress (full update)
export const updateUserProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      completedLessons, 
      currentTopic, 
      currentLesson, 
      unlockedTopics,
      totalStudyTime 
    } = req.body;
    
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({ userId });
    }
    
    if (completedLessons !== undefined) userProgress.completedLessons = completedLessons;
    if (currentTopic !== undefined) userProgress.currentTopic = currentTopic;
    if (currentLesson !== undefined) userProgress.currentLesson = currentLesson;
    if (unlockedTopics !== undefined) userProgress.unlockedTopics = unlockedTopics;
    if (totalStudyTime !== undefined) userProgress.totalStudyTime = totalStudyTime;
    
    userProgress.lastActivity = new Date();
    
    await userProgress.save();
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật tiến độ học tập',
      data: userProgress
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Check if lesson is completed
export const checkLessonCompleted = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicId, lessonId } = req.query;
    
    if (!topicId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu topicId hoặc lessonId'
      });
    }
    
    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(200).json({
        success: true,
        data: { completed: false }
      });
    }
    
    const completed = userProgress.isLessonCompleted(
      parseInt(topicId), 
      parseInt(lessonId)
    );
    
    res.status(200).json({
      success: true,
      data: { completed }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get topic progress
export const getTopicProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicId } = req.query;
    
    if (!topicId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu topicId'
      });
    }
    
    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(200).json({
        success: true,
        data: { completedLessons: 0, progress: 0 }
      });
    }
    
    const completedCount = userProgress.getTopicProgress(parseInt(topicId));
    
    res.status(200).json({
      success: true,
      data: {
        topicId: parseInt(topicId),
        completedLessons: completedCount,
        progress: completedCount // Would need total lessons to calculate percentage
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

