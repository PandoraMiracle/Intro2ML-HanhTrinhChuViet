import { useState } from "react";
import type { ReviewLesson } from "../data/lessonContent";
import DrawingBoard from "./DrawingBoard";
import "./ReviewPage.css";

type Props = {
  review: ReviewLesson;
  onComplete?: (score: number) => void;
  onBackToMap?: () => void;
};

type ReviewStep =
  | "intro"
  | "combination"
  | "story"
  | "quiz"
  | "practice"
  | "writing"
  | "complete";

const ReviewPage = ({ review, onComplete, onBackToMap }: Props) => {
  const [currentStep, setCurrentStep] = useState<ReviewStep>("intro");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStoryPage, setCurrentStoryPage] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);

  const steps: ReviewStep[] = [
    "intro",
    "combination",
    "story",
    "quiz",
    "practice",
    "writing",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
    }
    if (steps[nextStepIndex] === "complete" && onComplete) {
      onComplete(score);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleCheckQuizAnswer = () => {
    const currentQuestion =
      review.story.comprehensionQuestions[currentQuizIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 15);
    }
  };

  const handleNextQuiz = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuizIndex < review.story.comprehensionQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      handleNextStep();
    }
  };

  const handlePracticeAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleCheckPractice = () => {
    const currentExercise = review.practiceExercises[practiceIndex];
    const correct = selectedAnswer === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNextPractice = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (practiceIndex < review.practiceExercises.length - 1) {
      setPracticeIndex((prev) => prev + 1);
    } else {
      handleNextStep();
    }
  };

  const renderIntro = () => (
    <div className="review-intro">
      <div className="review-badge">📚 Review</div>
      <h2>{review.title}</h2>

      <div className="sounds-learned">
        <h3>Sounds learned in this topic:</h3>
        <div className="sounds-grid">
          {review.summary.soundsLearned.map((sound, idx) => (
            <span key={idx} className="sound-chip">
              {sound}
            </span>
          ))}
        </div>
      </div>

      <div className="review-preview">
        <div className="preview-item">
          <span className="preview-icon">📊</span>
          <span>Sound Combination Table</span>
        </div>
        <div className="preview-item">
          <span className="preview-icon">📖</span>
          <span>Story: {review.story.title}</span>
        </div>
        <div className="preview-item">
          <span className="preview-icon">❓</span>
          <span>
            {review.story.comprehensionQuestions.length} comprehension questions
          </span>
        </div>
        <div className="preview-item">
          <span className="preview-icon">✍️</span>
          <span>Writing Practice</span>
        </div>
      </div>

      <button className="cta solid" onClick={handleNextStep}>
        Start Review 🚀
      </button>
    </div>
  );

  const renderCombinationTable = () => (
    <div className="combination-section">
      <h3>📊 Sound Combination Table</h3>
      <p className="section-desc">
        Combine consonants with the vowels you've learned
      </p>

      <div className="combination-table-wrapper">
        <table className="combination-table">
          <thead>
            <tr>
              <th></th>
              <th>a</th>
              <th>e</th>
              <th>ê</th>
              <th>i</th>
              <th>o</th>
              <th>ô</th>
            </tr>
          </thead>
          <tbody>
            {review.summary.combinationTable.map((row, idx) => (
              <tr key={idx}>
                <td className="consonant-cell">{row.consonant}</td>
                {["a", "e", "ê", "i", "o", "ô"].map((vowel, vIdx) => {
                  const combo = row.vowels.find((v) => v.vowel === vowel);
                  return (
                    <td key={vIdx} className={combo ? "has-combo" : "no-combo"}>
                      {combo ? combo.result : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-tip">
        💡 <strong>Tip:</strong> Click on a cell to hear the pronunciation!
      </div>

      <button className="cta solid" onClick={handleNextStep}>
        Continue →
      </button>
    </div>
  );

  const renderStory = () => (
    <div className="story-section">
      <h3>📖 Story: {review.story.title}</h3>

      <div className="story-container">
        <div className="story-image">
          {review.story.images && review.story.images[currentStoryPage] ? (
            <img
              src={review.story.images[currentStoryPage]}
              alt={`Page ${currentStoryPage + 1}`}
            />
          ) : (
            <div className="story-placeholder">
              <span>📚</span>
            </div>
          )}
        </div>

        <div className="story-text-box">
          <p className="story-text">{review.story.content[currentStoryPage]}</p>

          <button className="listen-btn">🔊 Listen</button>
        </div>

        <div className="story-nav">
          <button
            className="cta ghost"
            onClick={() =>
              setCurrentStoryPage(Math.max(0, currentStoryPage - 1))
            }
            disabled={currentStoryPage === 0}
          >
            ← Previous
          </button>
          <span className="story-page">
            {currentStoryPage + 1} / {review.story.content.length}
          </span>
          <button
            className="cta ghost"
            onClick={() =>
              setCurrentStoryPage(
                Math.min(review.story.content.length - 1, currentStoryPage + 1)
              )
            }
            disabled={currentStoryPage === review.story.content.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="story-dots">
          {review.story.content.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentStoryPage ? "active" : ""}`}
              onClick={() => setCurrentStoryPage(idx)}
            />
          ))}
        </div>
      </div>

      <button className="cta solid" onClick={handleNextStep}>
        Reading Comprehension Check →
      </button>
    </div>
  );

  const renderQuiz = () => {
    const currentQuestion =
      review.story.comprehensionQuestions[currentQuizIndex];

    return (
      <div className="quiz-section">
        <h3>❓ Reading Comprehension</h3>
        <p className="quiz-progress">
          Question {currentQuizIndex + 1} /{" "}
          {review.story.comprehensionQuestions.length}
        </p>

        <div className="quiz-box">
          <p className="quiz-question">{currentQuestion.question}</p>

          <div className="quiz-options">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`quiz-option ${
                  selectedAnswer === option ? "selected" : ""
                } ${
                  showFeedback
                    ? option === currentQuestion.correctAnswer
                      ? "correct"
                      : selectedAnswer === option
                      ? "incorrect"
                      : ""
                    : ""
                }`}
                onClick={() => !showFeedback && handleQuizAnswer(option)}
                disabled={showFeedback}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="option-text">{option}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div
              className={`quiz-feedback ${isCorrect ? "correct" : "incorrect"}`}
            >
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎉</span>
                  <div>
                    <strong>Correct! +15 points</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="feedback-icon">😅</span>
                  <div>
                    <strong>Not quite!</strong>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="quiz-actions">
          {!showFeedback ? (
            <button
              className="cta solid"
              onClick={handleCheckQuizAnswer}
              disabled={!selectedAnswer}
            >
              Check Answer
            </button>
          ) : (
            <button className="cta solid" onClick={handleNextQuiz}>
              {currentQuizIndex < review.story.comprehensionQuestions.length - 1
                ? "Next Question →"
                : "Continue →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPractice = () => {
    const currentExercise = review.practiceExercises[practiceIndex];

    return (
      <div className="practice-section">
        <h3>🎮 Practice Exercises</h3>
        <p className="practice-progress">
          Exercise {practiceIndex + 1} / {review.practiceExercises.length}
        </p>

        <div className="practice-box">
          <p className="practice-question">{currentExercise.question}</p>

          <div className="practice-options">
            {currentExercise.options?.map((option, idx) => (
              <button
                key={idx}
                className={`practice-option ${
                  selectedAnswer === option ? "selected" : ""
                } ${
                  showFeedback
                    ? option === currentExercise.correctAnswer
                      ? "correct"
                      : selectedAnswer === option
                      ? "incorrect"
                      : ""
                    : ""
                }`}
                onClick={() => !showFeedback && handlePracticeAnswer(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>

          {currentExercise.hint && !showFeedback && !selectedAnswer && (
            <p className="practice-hint">💡 {currentExercise.hint}</p>
          )}

          {showFeedback && (
            <div
              className={`practice-feedback ${
                isCorrect ? "correct" : "incorrect"
              }`}
            >
              {isCorrect
                ? "🎉 Correct! +10 points"
                : `😅 Correct answer: ${currentExercise.correctAnswer}`}
            </div>
          )}
        </div>

        <div className="practice-actions">
          {!showFeedback ? (
            <button
              className="cta solid"
              onClick={handleCheckPractice}
              disabled={!selectedAnswer}
            >
              Check Answer
            </button>
          ) : (
            <button className="cta solid" onClick={handleNextPractice}>
              {practiceIndex < review.practiceExercises.length - 1
                ? "Next →"
                : "Complete →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderWriting = () => (
    <div className="review-writing-section">
      <h3>✍️ Sentence Writing Practice</h3>
      <p className="section-desc">
        Rewrite the sentence from the story "{review.story.title}"
      </p>

      <div className="writing-prompt">
        <p className="prompt-text">"{review.story.content[0]}"</p>
      </div>

      <div className="writing-area">
        <p className="writing-instruction">
          Write the sentence above in the box below:
        </p>
        <DrawingBoard
          uploadUrl="/api/pic/upload"
          expectedAnswer={review.story.content[0]}
          onUploaded={(url, result) => {
            console.log("Drawing uploaded:", url, result);
          }}
          onMatchResult={(isMatched, userAnswer, expectedAnswer) => {
            console.log("Match result:", { isMatched, userAnswer, expectedAnswer });
            // Update score based on match result
            if (isMatched) {
              setScore((prev) => prev + 30); // Bonus points for correct sentence writing
            }
          }}
          strokeWidth={4}
        />
      </div>

      <button className="cta solid" onClick={handleNextStep}>
        Complete Review 🎉
      </button>
    </div>
  );

  const renderComplete = () => (
    <div className="review-complete">
      <div className="complete-celebration">🎊</div>
      <h2>Review Complete!</h2>
      <p className="complete-story-title">Topic: {review.title}</p>

      <div className="final-score">
        <span className="score-label">Total Score</span>
        <span className="score-number">{score}</span>
        <span className="score-unit">XP</span>
      </div>

      <div className="review-stats">
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span className="stat-text">
            {review.summary.combinationTable.length} consonant combinations
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📖</span>
          <span className="stat-text">
            {review.story.content.length} story pages
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">✅</span>
          <span className="stat-text">
            {review.story.comprehensionQuestions.length} questions
          </span>
        </div>
      </div>

      <div className="complete-message">
        <p>🌟 You've completed the review for this topic!</p>
        <p>Return to the roadmap to continue your learning journey.</p>
      </div>

      <div className="complete-buttons">
        <button className="cta ghost" onClick={() => window.location.reload()}>
          Review Again
        </button>
        <button 
          className="cta solid" 
          onClick={() => {
            if (onComplete) {
              onComplete(score);
            }
            if (onBackToMap) {
              onBackToMap();
            }
          }}
        >
          Complete Review →
        </button>
      </div>
    </div>
  );

  return (
    <div className="review-page">
      {/* Progress bar */}
      <div className="review-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="review-header">
        <button className="back-btn">←</button>
        <h1 className="review-title">Topic {review.topicId} Review</h1>
        <div className="score-badge">⭐ {score}</div>
      </div>

      {/* Main content */}
      <div className="review-content">
        {currentStep === "intro" && renderIntro()}
        {currentStep === "combination" && renderCombinationTable()}
        {currentStep === "story" && renderStory()}
        {currentStep === "quiz" && renderQuiz()}
        {currentStep === "practice" && renderPractice()}
        {currentStep === "writing" && renderWriting()}
        {currentStep === "complete" && renderComplete()}
      </div>
    </div>
  );
};

export default ReviewPage;
