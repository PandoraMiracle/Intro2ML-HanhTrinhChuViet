import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
  topicId: {
    type: Number,
    required: true
  },
  lessonId: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    // No max limit - score represents XP points, not percentage
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  }
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  completedLessons: {
    type: [lessonProgressSchema],
    default: []
  },
  currentTopic: {
    type: Number,
    default: 1
  },
  currentLesson: {
    type: Number,
    default: 1
  },
  unlockedTopics: {
    type: [Number],
    default: [1]
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  totalStudyTime: {
    type: Number, // in minutes
    default: 0,
    min: 0
  },
  lastStudyDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Check if lesson is completed
userProgressSchema.methods.isLessonCompleted = function(topicId, lessonId) {
  return this.completedLessons.some(
    lesson => lesson.topicId === topicId && 
              lesson.lessonId === lessonId && 
              lesson.completed === true
  );
};

// Add or update lesson progress
userProgressSchema.methods.addLessonProgress = function(topicId, lessonId, score = 0) {
  const existingIndex = this.completedLessons.findIndex(
    lesson => lesson.topicId === topicId && lesson.lessonId === lessonId
  );
  
  if (existingIndex >= 0) {
    // Update existing
    this.completedLessons[existingIndex].completed = true;
    this.completedLessons[existingIndex].completedAt = new Date();
    this.completedLessons[existingIndex].score = Math.max(
      this.completedLessons[existingIndex].score, 
      score
    );
    this.completedLessons[existingIndex].attempts += 1;
  } else {
    // Add new
    this.completedLessons.push({
      topicId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      score,
      attempts: 1
    });
  }
  
  this.lastActivity = new Date();
  this.lastStudyDate = new Date();
  
  return this.save();
};

// Unlock next topic if all lessons in current topic are completed
// Each topic has 5 lessons, unlock next topic when lesson 5 (review) is completed
userProgressSchema.methods.checkTopicCompletion = function(topicId) {
  // Check if lesson 5 (review lesson) of current topic is completed
  const reviewLessonCompleted = this.completedLessons.some(
    lesson => lesson.topicId === topicId && 
              lesson.lessonId === 5 && 
              lesson.completed === true
  );
  
  // If review lesson is completed, unlock next topic
  if (reviewLessonCompleted && !this.unlockedTopics.includes(topicId + 1)) {
    this.unlockedTopics.push(topicId + 1);
    // Sort to keep order
    this.unlockedTopics.sort((a, b) => a - b);
  }
  
  return this.save();
};

// Get progress percentage for a topic
userProgressSchema.methods.getTopicProgress = function(topicId) {
  const topicLessons = this.completedLessons.filter(
    lesson => lesson.topicId === topicId && lesson.completed
  );
  // Would need total lessons per topic from curriculum
  // For now return count
  return topicLessons.length;
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema, 'userProgress');

export default UserProgress;

