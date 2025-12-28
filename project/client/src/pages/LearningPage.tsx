import { useState, useEffect } from "react";
import CurriculumMap from "../components/CurriculumMap";
import LessonPage from "../components/LessonPage";
import ReviewPage from "../components/ReviewPage";
import {
  lesson1_SoundA,
  topic2_Lesson5_Review,
  lessonsContent,
} from "../data/lessonContent";
import { curriculum } from "../data/curriculum";
import { userProgressApi, userExpApi } from "../utils/api";
import "./LearningPage.css";

type ViewMode = "map" | "lesson" | "review";

type SelectedLesson = {
  topicId: number;
  lessonId: number;
};

const LearningPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(
    null
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [unlockedTopics, setUnlockedTopics] = useState<number[]>([1]);
  const [loading, setLoading] = useState(true);

  // Load user progress from API
  useEffect(() => {
    const loadUserProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const progress = await userProgressApi.get();
        
        // Convert completedLessons to format: "topicId-lessonId"
        const completed = progress.completedLessons
          .filter((lesson: any) => lesson.completed)
          .map((lesson: any) => `${lesson.topicId}-${lesson.lessonId}`);
        
        setCompletedLessons(completed);
        setUnlockedTopics(progress.unlockedTopics || [1]);
      } catch (err) {
        console.error("Failed to load user progress:", err);
        // Fallback to localStorage
        const saved = localStorage.getItem("completedLessons");
        if (saved) {
          setCompletedLessons(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, []);

  // Refresh progress when returning to map view
  useEffect(() => {
    if (viewMode === "map") {
      const refreshProgress = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const progress = await userProgressApi.get();
          const completed = progress.completedLessons
            .filter((lesson: any) => lesson.completed)
            .map((lesson: any) => `${lesson.topicId}-${lesson.lessonId}`);
          
          setCompletedLessons(completed);
          setUnlockedTopics(progress.unlockedTopics || [1]);
        } catch (err) {
          console.error("Failed to refresh progress:", err);
        }
      };

      refreshProgress();
    }
  }, [viewMode]);

  const handleSelectLesson = (topicId: number, lessonId: number) => {
    setSelectedLesson({ topicId, lessonId });

    // Check if it's a review lesson (lesson 5)
    if (lessonId === 5) {
      setViewMode("review");
    } else {
      setViewMode("lesson");
    }
  };

  const handleLessonComplete = async (score: number) => {
    if (!selectedLesson) return;

    const token = localStorage.getItem("token");
    if (!token) {
      // Fallback to localStorage if not logged in
      const lessonKey = `${selectedLesson.topicId}-${selectedLesson.lessonId}`;
      if (!completedLessons.includes(lessonKey)) {
        const updated = [...completedLessons, lessonKey];
        setCompletedLessons(updated);
        localStorage.setItem("completedLessons", JSON.stringify(updated));
      }
      return;
    }

    try {
      // Save lesson progress to database
      await userProgressApi.addLesson(
        selectedLesson.topicId,
        selectedLesson.lessonId,
        score
      );

      // Add exp points (score = exp points)
      await userExpApi.addExp(score);

      // Update streak
      await userExpApi.updateStreak();

      // Reload progress to get updated data (including unlocked topics)
      const progress = await userProgressApi.get();
      const completed = progress.completedLessons
        .filter((lesson: any) => lesson.completed)
        .map((lesson: any) => `${lesson.topicId}-${lesson.lessonId}`);
      
      setCompletedLessons(completed);
      setUnlockedTopics(progress.unlockedTopics || [1]);

      // Trigger XP update event for header
      window.dispatchEvent(new Event("xpUpdated"));

      // Also update localStorage as fallback
      localStorage.setItem("completedLessons", JSON.stringify(completed));
    } catch (err) {
      console.error("Failed to save lesson progress:", err);
      // Fallback to localStorage
      const lessonKey = `${selectedLesson.topicId}-${selectedLesson.lessonId}`;
      if (!completedLessons.includes(lessonKey)) {
        const updated = [...completedLessons, lessonKey];
        setCompletedLessons(updated);
        localStorage.setItem("completedLessons", JSON.stringify(updated));
      }
    }
  };

  const handleBackToMap = () => {
    setViewMode("map");
    setSelectedLesson(null);
  };

  // Find lesson data from curriculum
  const getCurrentLessonContent = () => {
    if (!selectedLesson) return null;
    const key = `topic${selectedLesson.topicId}-lesson${selectedLesson.lessonId}`;
    return lessonsContent[key] || null;
  };

  // Find next lesson (same topic, next id; or next topic first lesson)
  const getNextLesson = () => {
    if (!selectedLesson) return null;
    const topicIdx = curriculum.topics.findIndex(
      (t) => t.id === selectedLesson.topicId
    );
    const topic = curriculum.topics[topicIdx];
    if (!topic) return null;
    const lessonIdx = topic.lessons.findIndex(
      (l) => l.id === selectedLesson.lessonId
    );
    // Next lesson in same topic
    if (lessonIdx < topic.lessons.length - 1) {
      const nextLessonId = topic.lessons[lessonIdx + 1].id;
      const key = `topic${selectedLesson.topicId}-lesson${nextLessonId}`;
      if (lessonsContent[key]) {
        return { topicId: topic.id, lessonId: nextLessonId };
      }
    }
    // First lesson of next topic
    if (topicIdx < curriculum.topics.length - 1) {
      const nextTopicId = curriculum.topics[topicIdx + 1].id;
      const key = `topic${nextTopicId}-lesson1`;
      if (lessonsContent[key]) {
        return { topicId: nextTopicId, lessonId: 1 };
      }
    }
    return null;
  };

  const getCurrentReviewContent = () => {
    // For demo, return topic2 review
    if (selectedLesson?.topicId === 2) {
      return topic2_Lesson5_Review;
    }
    return topic2_Lesson5_Review; // Default fallback
  };

  return (
    <div className="learning-page">
      {/* Top bar with XP */}
      <div className="topbar-left">
        <button className="back-to-map-btn" onClick={handleBackToMap}>
          ← Roadmap
        </button>
      </div>

      {/* Main content */}
      <div className="learning-content">
        {viewMode === "map" && (
          <CurriculumMap
            onSelectLesson={handleSelectLesson}
            completedLessons={completedLessons}
            unlockedTopics={unlockedTopics}
          />
        )}

        {viewMode === "lesson" && getCurrentLessonContent() && (
          <LessonPage
            lesson={getCurrentLessonContent()}
            onComplete={handleLessonComplete}
            onNextLesson={() => {
              const next = getNextLesson();
              if (next) {
                setSelectedLesson(next);
                setViewMode(next.lessonId === 5 ? "review" : "lesson");
              } else {
                setViewMode("map");
                setSelectedLesson(null);
              }
            }}
            onBack={() => {
              setViewMode("map");
              setSelectedLesson(null);
            }}
          />
        )}

        {viewMode === "review" && (
          <ReviewPage
            review={getCurrentReviewContent()}
            onComplete={handleLessonComplete}
            onBackToMap={handleBackToMap}
          />
        )}
      </div>
    </div>
  );
};

export default LearningPage;
