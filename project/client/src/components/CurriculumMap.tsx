import { useState } from "react";
import { curriculum } from "../data/curriculum";
import type { Topic, Lesson } from "../data/curriculum";
import "./CurriculumMap.css";

type Props = {
  onSelectLesson?: (topicId: number, lessonId: number) => void;
  completedLessons?: string[]; // format: "topicId-lessonId"
  unlockedTopics?: number[]; // Array of unlocked topic IDs
};

const CurriculumMap = ({ 
  onSelectLesson, 
  completedLessons = [],
  unlockedTopics = [1]
}: Props) => {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(1);

  const isLessonCompleted = (topicId: number, lessonId: number) => {
    return completedLessons.includes(`${topicId}-${lessonId}`);
  };

  const isTopicUnlocked = (topicId: number) => {
    return unlockedTopics.includes(topicId);
  };

  const isLessonUnlocked = (topicId: number, lessonId: number) => {
    // Topic must be unlocked first
    if (!isTopicUnlocked(topicId)) return false;

    // First lesson of first topic is always unlocked
    if (topicId === 1 && lessonId === 1) return true;

    // Previous lesson in same topic must be completed
    if (lessonId > 1) {
      return isLessonCompleted(topicId, lessonId - 1);
    }

    // First lesson of topic: previous topic's lesson 5 must be completed
    if (lessonId === 1 && topicId > 1) {
      return isLessonCompleted(topicId - 1, 5);
    }

    return false;
  };

  const getTopicProgress = (topic: Topic) => {
    const completed = topic.lessons.filter((l) =>
      isLessonCompleted(topic.id, l.id)
    ).length;
    return Math.round((completed / topic.lessons.length) * 100);
  };

  const handleLessonClick = (topicId: number, lesson: Lesson) => {
    if (
      (isLessonUnlocked(topicId, lesson.id) ||
        isLessonCompleted(topicId, lesson.id)) &&
      onSelectLesson
    ) {
      onSelectLesson(topicId, lesson.id);
    }
  };

  const toggleTopic = (topicId: number) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="curriculum-map">
      <div className="map-header">
        <h1>🗺️ Learning Roadmap</h1>
        <p className="map-subtitle">{curriculum.titleEn || curriculum.title}</p>
        <p className="map-desc">
          {curriculum.descriptionEn || curriculum.description}
        </p>
      </div>

      <div className="topics-container">
        {curriculum.topics.map((topic) => {
          const progress = getTopicProgress(topic);
          const isExpanded = expandedTopic === topic.id;
          const isActive = topic.lessons.some(
            (l) =>
              isLessonUnlocked(topic.id, l.id) &&
              !isLessonCompleted(topic.id, l.id)
          );

          return (
            <div
              key={topic.id}
              className={`topic-card ${isExpanded ? "expanded" : ""} ${
                isActive ? "active" : ""
              }`}
              style={{ "--topic-color": topic.color } as React.CSSProperties}
            >
              <div
                className="topic-header"
                onClick={() => toggleTopic(topic.id)}
              >
                <div className="topic-number">
                  <span>{topic.id}</span>
                </div>
                <div className="topic-info">
                  <h3 className="topic-name">{topic.nameEn || topic.name}</h3>
                  <p className="topic-description">
                    {topic.descriptionEn || topic.description}
                  </p>
                </div>
                <div className="topic-progress">
                  <div className="progress-ring">
                    <svg viewBox="0 0 36 36">
                      <path
                        className="progress-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="progress-fill"
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="progress-text">{progress}%</span>
                  </div>
                  <span className="expand-icon">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="lessons-list">
                  {topic.lessons.map((lesson) => {
                    const completed = isLessonCompleted(topic.id, lesson.id);
                    const unlocked = isLessonUnlocked(topic.id, lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        className={`lesson-item ${
                          completed ? "completed" : ""
                        } ${unlocked ? "unlocked" : "locked"} ${
                          lesson.isReview ? "review" : ""
                        }`}
                        onClick={() => handleLessonClick(topic.id, lesson)}
                      >
                        <div className="lesson-icon">
                          {completed
                            ? "✅"
                            : unlocked
                            ? lesson.isReview
                              ? "📚"
                              : "📖"
                            : "🔒"}
                        </div>
                        <div className="lesson-info">
                          <span className="lesson-number">
                            Lesson {lesson.id}
                          </span>
                          <span className="lesson-title">{lesson.title}</span>
                          {lesson.isReview && lesson.storyTitle && (
                            <span className="story-tag">
                              📖 {lesson.storyTitle}
                            </span>
                          )}
                        </div>

                        {unlocked && !completed && (
                          <span className="start-btn">Learn →</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="curriculum-summary">
        <h2>📊 Curriculum Overview</h2>
        <div className="summary-table-wrapper">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Name</th>
                {/* <th>Sounds/Rhymes</th> */}
                <th>Review Story</th>
              </tr>
            </thead>
            <tbody>
              {curriculum.topics.map((topic) => (
                <tr key={topic.id}>
                  <td className="topic-num">{topic.id}</td>
                  <td className="topic-name-cell">
                    {topic.nameEn || topic.name}
                  </td>
                  {/* <td className="sounds-cell">
                    {topic.lessons
                      .filter((l) => !l.isReview)
                      .flatMap((l) => l.sounds.map((s) => s.displayName))
                      .join(", ") || "Practice"}
                  </td> */}
                  <td className="story-cell">
                    {(() => {
                      const reviewLesson = topic.lessons.find(
                        (l) => l.isReview
                      );
                      return (
                        reviewLesson?.storyTitleEn ||
                        reviewLesson?.storyTitle ||
                        "-"
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurriculumMap;
