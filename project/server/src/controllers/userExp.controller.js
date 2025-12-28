import UserExp from '../models/userExp.model.js';
import User from '../models/user.model.js';

// Get user exp data
export const getUserExp = async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware
    
    let userExp = await UserExp.findOne({ userId });
    
    // Create if doesn't exist
    if (!userExp) {
      userExp = new UserExp({ userId });
      await userExp.save();
    }
    
    res.status(200).json({
      success: true,
      data: userExp
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update user exp (add exp points)
export const addExp = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số điểm exp không hợp lệ'
      });
    }
    
    let userExp = await UserExp.findOne({ userId });
    
    if (!userExp) {
      userExp = new UserExp({ userId });
    }
    
    // Add exp and auto-update level
    await userExp.addExp(amount);
    
    // Update streak if needed
    userExp.updateStreak();
    await userExp.save();
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật exp',
      data: userExp
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update user exp data (full update)
export const updateUserExp = async (req, res) => {
  try {
    const userId = req.userId;
    const { exp, level, levelName, streak, totalLessonsCompleted, totalWordsLearned } = req.body;
    
    let userExp = await UserExp.findOne({ userId });
    
    if (!userExp) {
      userExp = new UserExp({ userId });
    }
    
    if (exp !== undefined) userExp.exp = exp;
    if (level !== undefined) userExp.level = level;
    if (levelName !== undefined) userExp.levelName = levelName;
    if (streak !== undefined) userExp.streak = streak;
    if (totalLessonsCompleted !== undefined) userExp.totalLessonsCompleted = totalLessonsCompleted;
    if (totalWordsLearned !== undefined) userExp.totalWordsLearned = totalWordsLearned;
    
    // Recalculate level if exp changed
    if (exp !== undefined) {
      userExp.calculateLevel();
    }
    
    await userExp.save();
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật thông tin exp',
      data: userExp
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update streak manually (usually called daily)
export const updateStreak = async (req, res) => {
  try {
    const userId = req.userId;
    
    let userExp = await UserExp.findOne({ userId });
    
    if (!userExp) {
      userExp = new UserExp({ userId });
    }
    
    const newStreak = userExp.updateStreak();
    await userExp.save();
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật streak',
      data: {
        streak: newStreak,
        lastStreakDate: userExp.lastStreakDate
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get leaderboard (top users by exp)
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await UserExp.find()
      .populate('userId', 'fullname email')
      .sort({ exp: -1 })
      .limit(limit)
      .select('userId exp level levelName streak');
    
    res.status(200).json({
      success: true,
      data: leaderboard.map((item, index) => ({
        rank: index + 1,
        name: item.userId?.fullname || 'User',
        xp: item.exp.toLocaleString() + ' XP',
        level: item.level,
        levelName: item.levelName,
        streak: item.streak
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

