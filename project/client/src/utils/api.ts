// API utility functions

const API_BASE = '/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// UserExp API
export const userExpApi = {
  // Get user exp data
  get: async () => {
    const response = await fetch(`${API_BASE}/userExp`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user exp');
    return data.data;
  },

  // Add exp points
  addExp: async (amount: number) => {
    const response = await fetch(`${API_BASE}/userExp/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add exp');
    return data.data;
  },

  // Update user exp
  update: async (expData: {
    exp?: number;
    level?: number;
    levelName?: string;
    streak?: number;
    totalLessonsCompleted?: number;
    totalWordsLearned?: number;
  }) => {
    const response = await fetch(`${API_BASE}/userExp`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user exp');
    return data.data;
  },

  // Update streak
  updateStreak: async () => {
    const response = await fetch(`${API_BASE}/userExp/streak`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update streak');
    return data.data;
  },

  // Get leaderboard (no auth required)
  getLeaderboard: async (limit: number = 10) => {
    const response = await fetch(`${API_BASE}/userExp/leaderboard?limit=${limit}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch leaderboard');
    return data.data;
  },
};

// UserProgress API
export const userProgressApi = {
  // Get user progress
  get: async () => {
    const response = await fetch(`${API_BASE}/userProgress`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user progress');
    return data.data;
  },

  // Add lesson progress
  addLesson: async (topicId: number, lessonId: number, score?: number) => {
    const response = await fetch(`${API_BASE}/userProgress/lesson`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topicId, lessonId, score }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add lesson progress');
    return data.data;
  },

  // Update user progress
  update: async (progressData: {
    completedLessons?: any[];
    currentTopic?: number;
    currentLesson?: number;
    unlockedTopics?: number[];
    totalStudyTime?: number;
  }) => {
    const response = await fetch(`${API_BASE}/userProgress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user progress');
    return data.data;
  },

  // Check if lesson is completed
  checkLesson: async (topicId: number, lessonId: number) => {
    const response = await fetch(
      `${API_BASE}/userProgress/lesson/check?topicId=${topicId}&lessonId=${lessonId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to check lesson');
    return data.data.completed;
  },

  // Get topic progress
  getTopicProgress: async (topicId: number) => {
    const response = await fetch(`${API_BASE}/userProgress/topic?topicId=${topicId}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch topic progress');
    return data.data;
  },
};

