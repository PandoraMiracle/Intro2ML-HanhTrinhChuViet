import mongoose from 'mongoose';

const userExpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  exp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  levelName: {
    type: String,
    default: 'Mầm non'
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStreakDate: {
    type: Date,
    default: Date.now
  },
  totalLessonsCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWordsLearned: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Auto-calculate level based on exp (every 1000 exp = 1 level)
userExpSchema.methods.calculateLevel = function() {
  const newLevel = Math.floor(this.exp / 1000) + 1;
  if (newLevel !== this.level) {
    this.level = newLevel;
    // Update level name based on level
    const levelNames = [
      'Mầm non',      // 1
      'Lớp lá',       // 2
      'Lớp 1',        // 3
      'Lớp 2',        // 4
      'Lớp 3',        // 5
      'Lớp 4',        // 6
      'Lớp 5',        // 7
      'Lớp 6',        // 8
      'Lớp 7',        // 9
      'Lớp 8',        // 10
      'Lớp 9',        // 11
      'Lớp 10',       // 12
      'Lớp 11',       // 13
      'Lớp 12',       // 14
      'Đại học',      // 15+
    ];
    this.levelName = levelNames[Math.min(newLevel - 1, levelNames.length - 1)] || 'Thạc sĩ';
  }
  return this.level;
};

// Update streak - check if last streak was yesterday or today
userExpSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastDate = new Date(this.lastStreakDate);
  
  // Reset time to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastStreakDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  
  const diffDays = Math.floor((today - lastStreakDay) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Already updated today
    return this.streak;
  } else if (diffDays === 1) {
    // Consecutive day
    this.streak += 1;
    this.lastStreakDate = now;
  } else {
    // Streak broken
    this.streak = 1;
    this.lastStreakDate = now;
  }
  
  return this.streak;
};

// Add exp and auto-update level
userExpSchema.methods.addExp = function(amount) {
  this.exp += amount;
  this.calculateLevel();
  return this.save();
};

const UserExp = mongoose.model('UserExp', userExpSchema, 'userExp');

export default UserExp;

