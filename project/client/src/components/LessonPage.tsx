import { useState, useEffect } from "react";
import type { LessonContent, GameQuestion } from "../data/lessonContent";
import DrawingBoard from "./DrawingBoard";
import "./LessonPage.css";

type Props = {
  lesson: LessonContent;
  onComplete?: (score: number) => void;
  onNextLesson?: () => void;
  onBack?: () => void;
};

type LessonStep =
  | "intro"
  | "vocab"
  | "game1"
  | "game2"
  | "game3"
  | "sentences"
  | "writing"
  | "complete";

const LessonPage = ({ lesson, onComplete, onNextLesson, onBack }: Props) => {
  const [currentStep, setCurrentStep] = useState<LessonStep>("intro");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [vocabIndex, setVocabIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const steps: LessonStep[] = [
    "intro",
    "vocab",
    "game1",
    "game2",
    "game3",
    "sentences",
    "writing",
    "complete",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Reset hasCompleted when lesson changes
  useEffect(() => {
    setHasCompleted(false);
  }, [lesson]);

  // Ensure progress is saved when reaching complete step
  useEffect(() => {
    if (currentStep === "complete" && onComplete && !hasCompleted) {
      onComplete(score);
      setHasCompleted(true);
    }
  }, [currentStep, score, onComplete, hasCompleted]);

  const getCurrentGame = (): GameQuestion[] => {
    switch (currentStep) {
      case "game1":
        return lesson.games.game1;
      case "game2":
        return lesson.games.game2;
      case "game3":
        return lesson.games.game3 || [];
      default:
        return [];
    }
  };

  const handleSelectAnswer = (answer: string) => {
    const currentGame = getCurrentGame()[currentGameIndex];

    if (Array.isArray(currentGame.correctAnswer)) {
      // Multiple selection
      setSelectedAnswers((prev) =>
        prev.includes(answer)
          ? prev.filter((a) => a !== answer)
          : [...prev, answer]
      );
    } else {
      // Single selection
      setSelectedAnswers([answer]);
    }
  };

  const handleCheckAnswer = () => {
    const currentGame = getCurrentGame()[currentGameIndex];
    let correct = false;

    if (Array.isArray(currentGame.correctAnswer)) {
      const correctSet = new Set(currentGame.correctAnswer);
      const selectedSet = new Set(selectedAnswers);
      correct =
        correctSet.size === selectedSet.size &&
        [...correctSet].every((a) => selectedSet.has(a));
    } else {
      correct = selectedAnswers[0] === currentGame.correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    const games = getCurrentGame();
    setShowFeedback(false);
    setSelectedAnswers([]);

    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex((prev) => prev + 1);
    } else {
      // Move to next step
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex]);
        setCurrentGameIndex(0);
      }
    }
  };

  const handleNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
    }
    // Call onComplete when reaching complete step
    if (steps[nextStepIndex] === "complete" && onComplete && !hasCompleted) {
      onComplete(score);
      setHasCompleted(true);
    }
  };


  const renderIntro = () => {
    if (!lesson || !lesson.targetSound) {
      return (
        <div className="lesson-intro-error">
          <h2>Lesson data not found</h2>
          <p>
            Sorry, this lesson could not be loaded. Please return to the roadmap
            and try again.
          </p>
          {onNextLesson && (
            <button className="cta solid" onClick={onNextLesson}>
              Next Lesson →
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="lesson-intro">
        <div className="sound-display">
          <span className="big-letter">{lesson.targetSound.displayName}</span>
          <span className="pronunciation">
            {lesson.targetSound.pronunciation}
          </span>
        </div>
        <p className="sound-description">{lesson.targetSound.description}</p>

        <div className="objectives-box">
          <h3>🎯 Learning Objectives</h3>
          <ul>
            {lesson.objectives.map((obj: string, idx: number) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </div>

        <button className="cta solid" onClick={handleNextStep}>
          Start Learning 🚀
        </button>
      </div>
    );
  };

  const renderVocabulary = () => {
    if (!lesson.vocabulary || lesson.vocabulary.length === 0) {
      return (
        <div className="vocab-section">
          <h3>📚 Vocabulary</h3>
          <p>No vocabulary words available for this lesson.</p>
          <button className="cta solid" onClick={handleNextStep}>
            Continue →
          </button>
        </div>
      );
    }

    return (
      <div className="vocab-section">
        <h3>📚 Vocabulary</h3>

        <div className="vocab-carousel">
          <div className="vocab-card main-card">
            <div className="vocab-image">
              {lesson.vocabulary[vocabIndex].image ? (
                <img
                  src={lesson.vocabulary[vocabIndex].image}
                  alt={lesson.vocabulary[vocabIndex].word}
                />
              ) : (
                <span className="vocab-emoji">📖</span>
              )}
            </div>
            <div className="vocab-word">
              {lesson.vocabulary[vocabIndex].word}
            </div>
            <div className="vocab-meaning">
              {lesson.vocabulary[vocabIndex].meaning}
            </div>
            <div className="vocab-syllables">
              {lesson.vocabulary[vocabIndex].syllables.map(
                (s: string, i: number) => (
                  <span key={i} className="syllable">
                    {s}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="vocab-nav">
          <button
            className="cta ghost"
            onClick={() => setVocabIndex(Math.max(0, vocabIndex - 1))}
            disabled={vocabIndex === 0}
          >
            ← Previous
          </button>
          <span className="vocab-counter">
            {vocabIndex + 1} / {lesson.vocabulary.length}
          </span>
          <button
            className="cta ghost"
            onClick={() =>
              setVocabIndex(
                Math.min(lesson.vocabulary.length - 1, vocabIndex + 1)
              )
            }
            disabled={vocabIndex === lesson.vocabulary.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="vocab-grid">
          {lesson.vocabulary.map((v, idx) => (
            <div
              key={v.id}
              className={`vocab-thumb ${idx === vocabIndex ? "active" : ""}`}
              onClick={() => setVocabIndex(idx)}
            >
              <span>{v.word}</span>
            </div>
          ))}
        </div>

        <button className="cta solid" onClick={handleNextStep}>
          Continue →
        </button>
      </div>
    );
  };

  const renderGame = () => {
    const games = getCurrentGame();
    if (games.length === 0) {
      return (
        <div className="game-section">
          <h3>No Games Available</h3>
          <p>This lesson doesn't have games for this section.</p>
          <button className="cta solid" onClick={handleNextStep}>
            Continue →
          </button>
        </div>
      );
    }

    const currentGame = games[currentGameIndex];
    const gameTitle =
      currentStep === "game1"
        ? "🎮 Game 1: Select Images with Correct Sound"
        : currentStep === "game2"
          ? "🎮 Game 2: Blend Sounds into Words"
          : "🎮 Game 3: Fill in the Missing Letter";

    return (
      <div className="game-section">
        <h3>{gameTitle}</h3>
        <p className="game-progress">
          Question {currentGameIndex + 1} / {games.length}
        </p>

        <div className="question-box">
          <p className="question-text">{currentGame.question}</p>

          <div className="options-grid">
            {currentGame.options?.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedAnswers.includes(option) ? "selected" : ""
                  } ${showFeedback
                    ? (
                      Array.isArray(currentGame.correctAnswer)
                        ? currentGame.correctAnswer.includes(option)
                        : currentGame.correctAnswer === option
                    )
                      ? "correct"
                      : selectedAnswers.includes(option)
                        ? "incorrect"
                        : ""
                    : ""
                  }`}
                onClick={() => !showFeedback && handleSelectAnswer(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>

          {currentGame.hint &&
            !showFeedback &&
            selectedAnswers.length === 0 && (
              <p className="hint-text">💡 Hint: {currentGame.hint}</p>
            )}

          {showFeedback && (
            <div
              className={`feedback-box ${isCorrect ? "correct" : "incorrect"}`}
            >
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎉</span>
                  <span>Correct! +10 points</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">😅</span>
                  <span>
                    Not quite! The answer is:{" "}
                    {Array.isArray(currentGame.correctAnswer)
                      ? currentGame.correctAnswer.join(", ")
                      : currentGame.correctAnswer}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="game-actions">
          {!showFeedback ? (
            <button
              className="cta solid"
              onClick={handleCheckAnswer}
              disabled={selectedAnswers.length === 0}
            >
              Check Answer
            </button>
          ) : (
            <button className="cta solid" onClick={handleNextQuestion}>
              {currentGameIndex < games.length - 1
                ? "Next Question →"
                : "Complete →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSentences = () => {
    if (!lesson.sentences || lesson.sentences.length === 0) {
      return (
        <div className="sentences-section">
          <h3>📖 Practice Sentences</h3>
          <p>No practice sentences available for this lesson.</p>
          <button className="cta solid" onClick={handleNextStep}>
            Continue →
          </button>
        </div>
      );
    }

    return (
      <div className="sentences-section">
        <h3>📖 Practice Sentences</h3>
        <p className="section-desc">
          Read sentences containing the "{lesson.targetSound.letter}" sound you
          just learned
        </p>

        <div className="sentences-list">
          {lesson.sentences.map((sentence, idx) => (
            <div key={idx} className="sentence-card">
              <p className="sentence-text">
                {sentence.text.split(" ").map((word: string, wIdx: number) => (
                  <span
                    key={wIdx}
                    className={
                      sentence.highlight.some((h) =>
                        word.toLowerCase().includes(h.toLowerCase())
                      )
                        ? "highlight"
                        : ""
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </p>
              {sentence.translation && (
                <p className="sentence-translation">{sentence.translation}</p>
              )}
              <button className="sound-btn" title="Listen to pronunciation">
                🔊
              </button>
            </div>
          ))}
        </div>

        <button className="cta solid" onClick={handleNextStep}>
          Continue →
        </button>
      </div>
    );
  };

  const renderWriting = () => {
    if (!lesson.writingPractice) {
      return (
        <div className="writing-section">
          <h3>✍️ Practice Writing</h3>
          <p>No writing practice available for this lesson.</p>
          <button className="cta solid" onClick={handleNextStep}>
            Complete Lesson 🎉
          </button>
        </div>
      );
    }

    return (
      <div className="writing-section">
        <h3>✍️ Practice Writing "{lesson.writingPractice.letter}"</h3>

        <div className="stroke-guide">
          <h4>Stroke Order Guide:</h4>
          <ol>
            {lesson.writingPractice.strokeOrder.map(
              (step: string, idx: number) => (
                <li key={idx}>{step}</li>
              )
            )}
          </ol>
        </div>

        <div className="writing-practice">
          <div className="guide-letter">
            <span className="trace-letter">
              {lesson.writingPractice.letter}
            </span>
          </div>

          <div className="drawing-area">
            <p className="drawing-instruction">
              {`Write the letter "${lesson.writingPractice.letter}" in the box below:`}
            </p>
            <DrawingBoard
              uploadUrl="/api/pic/upload"
              expectedAnswer={lesson.writingPractice.letter}
              onUploaded={(url, result) => {
                console.log("Drawing uploaded:", url, result);
              }}
              onMatchResult={(isMatched, userAnswer, expectedAnswer) => {
                console.log("Match result:", { isMatched, userAnswer, expectedAnswer });
                // Update score based on match result
                if (isMatched && !hasCompleted) {
                  setScore((prev) => prev + 20); // Bonus points for correct writing
                }
              }}
              strokeWidth={5}
            />
          </div>
        </div>

        <button className="cta solid" onClick={handleNextStep}>
          Complete Lesson 🎉
        </button>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="complete-section">
      <div className="complete-icon">🎉</div>
      <h2>Lesson Complete!</h2>
      <p className="complete-title">{lesson.title}</p>

      <div className="score-display">
        <span className="score-label">Your Score</span>
        <span className="score-value">{score}</span>
        <span className="score-xp">XP</span>
      </div>

      <div className="complete-summary">
        <div className="summary-item">
          <span className="summary-icon">📚</span>
          <span>{lesson.vocabulary.length} vocabulary words</span>
        </div>
        <div className="summary-item">
          <span className="summary-icon">🎮</span>
          <span>
            {(lesson.games.game1?.length || 0) +
              (lesson.games.game2?.length || 0) +
              (lesson.games.game3?.length || 0)}{" "}
            questions
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-icon">✍️</span>
          <span>Practiced writing "{lesson.targetSound.letter}"</span>
        </div>
      </div>

      <div className="complete-actions">
        <button className="cta ghost" onClick={() => window.location.reload()}>
          Practice Again
        </button>
        <button className="cta solid" onClick={() => {
          // Ensure onComplete is called if not already called
          if (onComplete && !hasCompleted) {
            onComplete(score);
            setHasCompleted(true);
          }
          // Go back to roadmap
          if (onBack) {
            onBack();
          }
        }}>
          Back to Roadmap →
        </button>
      </div>
    </div>
  );

  if (!lesson) {
    return (
      <div className="lesson-page-error">
        <h2>Lesson not found</h2>
        <p>
          Sorry, this lesson could not be loaded. Please return to the roadmap
          and try again.
        </p>
        {onNextLesson && (
          <button className="cta solid" onClick={onNextLesson}>
            Next Lesson →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Progress bar */}
      <div className="lesson-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="lesson-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h1 className="lesson-title">{lesson.title}</h1>
        <div className="score-badge">⭐ {score}</div>
      </div>

      {/* Main content */}
      <div className="lesson-content">
        {currentStep === "intro" && renderIntro()}
        {currentStep === "vocab" && renderVocabulary()}
        {(currentStep === "game1" ||
          currentStep === "game2" ||
          currentStep === "game3") &&
          renderGame()}
        {currentStep === "sentences" && renderSentences()}
        {currentStep === "writing" && renderWriting()}
        {currentStep === "complete" && renderComplete()}
      </div>
    </div>
  );
};

export default LessonPage;
