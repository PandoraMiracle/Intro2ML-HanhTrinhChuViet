import { useState, useEffect } from "react";
import DrawingBoard from "../components/DrawingBoard";
import ResultPopup from "../components/ResultPopup";

// Types
type QuestionType = "ca_dao" | "doi_thuong";
type AnswerMode = "text" | "drawing";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  answer?: string; // Chỉ có cho ca_dao
  original?: string; // Câu gốc đầy đủ (ca_dao)
  category: string;
}

interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

// Python server URL
const PYTHON_SERVER = "http://localhost:5000";

function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerModes, setAnswerModes] = useState<Record<number, AnswerMode>>({});
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<AnswerResult[]>([]);

  // Load questions from Python server
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${PYTHON_SERVER}/practice/questions`);
      const data = await response.json();

      if (data.success && data.questions) {
        // Map questions to include category for display
        const mappedQuestions = data.questions.map((q: any) => ({
          ...q,
          category: q.type === "ca_dao" ? "Ca dao - Tục ngữ" : "Câu đời thường",
        }));
        setQuestions(mappedQuestions);

        // Initialize answer modes
        const modes: Record<number, AnswerMode> = {};
        mappedQuestions.forEach((q: Question) => {
          modes[q.id] = "text";
        });
        setAnswerModes(modes);
      } else {
        setError(data.error || "Không thể tải câu hỏi");
      }
    } catch (err) {
      console.error("Error loading questions:", err);
      setError("Không thể kết nối đến server Python");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerMode = answerModes[currentQuestion?.id] || "text";

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleDrawingUploaded = (questionId: number, ocrText: string) => {
    // Set OCR result as answer
    setAnswers((prev) => ({ ...prev, [questionId]: ocrText }));
  };

  const handleModeChange = (questionId: number, mode: AnswerMode) => {
    setAnswerModes((prev) => ({ ...prev, [questionId]: mode }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setChecking(true);

    try {
      // Prepare answers for batch check
      const answersToCheck = questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        user_answer: answers[q.id] || "",
        correct_answer: q.answer, // Chỉ có cho ca_dao
      }));

      const response = await fetch(`${PYTHON_SERVER}/practice/check-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersToCheck }),
      });

      const data = await response.json();

      if (data.success) {
        // Map results for ResultPopup
        const answerResults: AnswerResult[] = questions.map((q, idx) => {
          const result = data.results[idx];
          return {
            question: q.question,
            userAnswer: answers[q.id] || "(Chưa trả lời)",
            correctAnswer:
              result.correct_answer ||
              q.answer ||
              "(Không có đáp án cố định)",
            isCorrect: result.is_correct,
            explanation: result.explanation,
          };
        });

        setResults(answerResults);
        setShowResult(true);
      } else {
        setError(data.error || "Không thể kiểm tra câu trả lời");
      }
    } catch (err) {
      console.error("Error checking answers:", err);
      setError("Không thể kết nối đến server");
    } finally {
      setChecking(false);
    }
  };

  const handleRetry = () => {
    setShowResult(false);
    setResults([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    loadQuestions();
  };

  const score = results.filter((r) => r.isCorrect).length;
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e0ecd7",
            borderTopColor: "#4ca76f",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "#c33", marginBottom: "20px" }}>❌ {error}</p>
        <button className="cta solid" onClick={loadQuestions}>
          Thử lại
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <p>Không có câu hỏi nào.</p>
      </div>
    );
  }

  // Split question at ____ for display
  const questionParts = currentQuestion.question.split("____");

  return (
    <div style={{ padding: "20px 0" }}>
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Hành trình của bạn</p>
          <h2>Luyện tập Tiếng Việt</h2>
          <p className="section-lede">
            Điền từ còn thiếu vào các câu ca dao, tục ngữ và câu đời thường.
            Bạn có thể viết tay hoặc nhập từ bàn phím.
          </p>
        </div>
      </section>

      {/* Progress bar */}
      <section style={{ margin: "24px 0" }}>
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-500)" }}
          >
            Câu {currentQuestionIndex + 1} / {questions.length}
          </p>
          <div
            style={{
              flex: 1,
              height: "8px",
              background: "#e7f0e4",
              borderRadius: 999,
              margin: "0 16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--fern-500), var(--fern-300))",
                borderRadius: 999,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p
            style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-500)" }}
          >
            {Math.round(progress)}%
          </p>
        </div>

        {/* Question dots */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              title={`Câu ${idx + 1}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: `2px solid ${
                  idx === currentQuestionIndex ? "#4ca76f" : "#c0d8c0"
                }`,
                background:
                  idx === currentQuestionIndex
                    ? "#4ca76f"
                    : answers[q.id]
                    ? "#8fd9b4"
                    : "white",
                cursor: "pointer",
                padding: 0,
                transform: idx === currentQuestionIndex ? "scale(1.3)" : "none",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* Current question */}
      <section style={{ margin: "24px 0" }}>
        <div className="auth-card">
          <div>
            {/* Question type badge */}
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                background:
                  currentQuestion.type === "ca_dao"
                    ? "linear-gradient(135deg, rgba(246, 240, 179, 0.4), rgba(248, 209, 163, 0.3))"
                    : "linear-gradient(135deg, rgba(143, 217, 180, 0.3), rgba(76, 167, 111, 0.2))",
                borderRadius: 20,
                fontSize: "0.85rem",
                fontWeight: 600,
                color:
                  currentQuestion.type === "ca_dao" ? "#8b6914" : "#2d6a4f",
                marginBottom: "16px",
              }}
            >
              {currentQuestion.type === "ca_dao"
                ? "🎋 Ca dao - Tục ngữ"
                : "💬 Câu đời thường"}
            </div>

            {/* Question text */}
            <p
              style={{
                margin: "0 0 24px",
                fontSize: "1.3rem",
                lineHeight: 1.8,
                color: "var(--text-900)",
                padding: "20px",
                background: "#fafdf8",
                borderRadius: "12px",
                borderLeft: "4px solid #4ca76f",
              }}
            >
              {questionParts[0]}
              <span
                style={{
                  display: "inline-block",
                  minWidth: "80px",
                  margin: "0 4px",
                  padding: "4px 12px",
                  borderBottom: "3px solid #4ca76f",
                  color: answers[currentQuestion.id] ? "#2d6a4f" : "#4ca76f",
                  fontWeight: 600,
                }}
              >
                {answers[currentQuestion.id] || "______"}
              </span>
              {questionParts[1] || ""}
            </p>

            {/* Answer mode selector */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
                padding: "8px",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: 12,
                border: "1px solid #e7f0e4",
              }}
            >
              <button
                className={
                  currentAnswerMode === "text" ? "cta solid" : "cta ghost"
                }
                onClick={() => handleModeChange(currentQuestion.id, "text")}
                style={{ flex: 1, padding: "10px" }}
              >
                ⌨️ Nhập từ bàn phím
              </button>
              <button
                className={
                  currentAnswerMode === "drawing" ? "cta solid" : "cta ghost"
                }
                onClick={() => handleModeChange(currentQuestion.id, "drawing")}
                style={{ flex: 1, padding: "10px" }}
              >
                ✏️ Viết tay
              </button>
            </div>

            {/* Text input mode */}
            {currentAnswerMode === "text" && (
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "var(--text-700)",
                  }}
                >
                  Nhập đáp án:
                </label>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  placeholder="Nhập từ cần điền..."
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid var(--fern-500)",
                    borderRadius: 12,
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    color: "var(--text-900)",
                    background: "#fff",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--fern-700)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(76, 167, 111, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--fern-500)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {/* Drawing mode */}
            {currentAnswerMode === "drawing" && (
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <label style={{ fontWeight: 600, color: "var(--text-700)" }}>
                    Vẽ đáp án:
                  </label>
                  {answers[currentQuestion.id] && (
                    <span
                      style={{
                        padding: "6px 12px",
                        background: "rgba(76, 167, 111, 0.15)",
                        borderRadius: 8,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--fern-700)",
                      }}
                    >
                      Kết quả OCR: {answers[currentQuestion.id]}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    border: "1px solid #e7f0e4",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <DrawingBoard
                    uploadUrl={`${PYTHON_SERVER}/predict`}
                    expectedAnswer={currentQuestion.answer} // Only for ca_dao type
                    onUploaded={(ocrText) =>
                      handleDrawingUploaded(currentQuestion.id, ocrText)
                    }
                    onMatchResult={(isMatched, userAnswer, expectedAnswer) => {
                      // Optional: Can show realtime feedback if needed
                      console.log("Match result:", { isMatched, userAnswer, expectedAnswer });
                    }}
                    strokeColor="var(--fern-700)"
                    strokeWidth={4}
                  />
                </div>
              </div>
            )}

            {/* Current answer display */}
            {answers[currentQuestion.id] && (
              <div
                style={{
                  padding: "12px 16px",
                  background:
                    "linear-gradient(135deg, rgba(76, 167, 111, 0.08), rgba(143, 217, 180, 0.12))",
                  borderRadius: 10,
                  marginBottom: "20px",
                }}
              >
                <strong style={{ color: "var(--text-700)" }}>
                  Từ bạn đã chọn:
                </strong>{" "}
                <span
                  style={{
                    fontWeight: 700,
                    color: "#2d6a4f",
                    fontSize: "1.1rem",
                  }}
                >
                  {answers[currentQuestion.id]}
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
                marginTop: "24px",
              }}
            >
              <button
                className="cta ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                style={{ padding: "12px 24px" }}
              >
                ← Câu trước
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="cta solid"
                  onClick={handleSubmit}
                  disabled={checking}
                  style={{ padding: "12px 24px" }}
                >
                  {checking ? "Đang kiểm tra..." : "Nộp bài ✓"}
                </button>
              ) : (
                <button
                  className="cta solid"
                  onClick={handleNext}
                  style={{ padding: "12px 24px" }}
                >
                  Câu tiếp →
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Error toast */}
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fee2e2",
            color: "#c33",
            padding: "12px 20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#c33",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      <ResultPopup
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        onRetry={handleRetry}
        score={score}
        total={questions.length}
        results={results}
      />
    </div>
  );
}

export default GamePage;
