import { useState, useEffect } from "react";
import DrawingBoard from "../components/DrawingBoard";
import ResultPopup from "../components/ResultPopup";
// @ts-ignore - questions.js không có type definitions
import { parseQuestions } from "../utils/questions";

type Question = {
  id: number;
  questionFull: string;
  answer: string;
  category: string;
  parts: string[];
};

type AnswerMode = "text" | "drawing";

function GamePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Text answers
  const [drawingUrls, setDrawingUrls] = useState<Record<number, string>>({}); // Drawing image URLs
  const [drawingResults, setDrawingResults] = useState<Record<number, any>>({}); // Server response results
  const [answerModes, setAnswerModes] = useState<Record<number, AnswerMode>>(
    {}
  ); // Mode for each question
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<
    Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      answerType: "text" | "drawing";
    }>
  >([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await parseQuestions("/questions/questions1.txt");
        setQuestions(data as Question[]);
      } catch (error) {
        console.error("Lỗi load câu hỏi:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerMode = answerModes[currentQuestion?.id] || "text";

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleDrawingUploaded = (
    questionId: number,
    url: string,
    result?: any
  ) => {
    setDrawingUrls((prev) => ({ ...prev, [questionId]: url }));
    if (result) {
      setDrawingResults((prev) => ({ ...prev, [questionId]: result }));
    }
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

  const handleSubmit = () => {
    const newResults = questions.map((q) => {
      const mode = answerModes[q.id] || "text";
      let userAnswer = "";
      let answerType: "text" | "drawing" = "text";

      if (mode === "drawing" && drawingUrls[q.id]) {
        userAnswer = drawingUrls[q.id];
        answerType = "drawing";
      } else {
        userAnswer = (answers[q.id] || "").trim();
        answerType = "text";
      }

      // Chỉ so sánh nếu là text answer
      const isCorrect =
        answerType === "text"
          ? userAnswer.toLowerCase() === q.answer.trim().toLowerCase()
          : false; // Drawing answers cần OCR hoặc manual check

      return {
        question: q.questionFull,
        userAnswer: answerType === "drawing" ? "[Đã vẽ]" : userAnswer,
        correctAnswer: q.answer,
        isCorrect,
        answerType,
      };
    });

    setResults(newResults);
    setShowResult(true);
  };

  const score = results.filter((r) => r.isCorrect).length;
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <p>Đang tải câu hỏi...</p>
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

  return (
    <div style={{ padding: "20px 0" }}>
      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Hành trình của bạn</p>
          <h2>Đố vui Văn học Việt Nam</h2>
          <p className="section-lede">
            Điền từ còn thiếu vào các câu tục ngữ, ca dao và thơ Việt Nam. Bạn
            có thể viết tay hoặc nhập từ bàn phím.
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
      </section>

      {/* Current question */}
      <section style={{ margin: "24px 0" }}>
        <div className="auth-card">
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(76, 167, 111, 0.15)",
                borderRadius: 8,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--fern-700)",
                marginBottom: "16px",
              }}
            >
              {currentQuestion.category}
            </div>

            <p
              style={{
                margin: "0 0 24px",
                fontSize: "1.2rem",
                lineHeight: 1.8,
                color: "var(--text-900)",
              }}
            >
              {currentQuestion.parts[0]}
              <span
                style={{
                  display: "inline-block",
                  minWidth: "120px",
                  margin: "0 8px",
                  padding: "8px 12px",
                  border: "2px dashed var(--fern-500)",
                  borderRadius: 6,
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  color: "var(--text-900)",
                  background: "var(--mint-100)",
                  fontWeight: 600,
                }}
              >
                {currentAnswerMode === "drawing" &&
                drawingUrls[currentQuestion.id]
                  ? "✓ Đã vẽ"
                  : currentAnswerMode === "text" && answers[currentQuestion.id]
                  ? answers[currentQuestion.id]
                  : "______"}
              </span>
              {currentQuestion.parts[1]}
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
                  {drawingResults[currentQuestion.id] && (
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
                      Kết quả:{" "}
                      {typeof drawingResults[currentQuestion.id] === "string"
                        ? drawingResults[currentQuestion.id]
                        : drawingResults[currentQuestion.id].prediction ||
                          drawingResults[currentQuestion.id].text ||
                          JSON.stringify(drawingResults[currentQuestion.id])}
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
                    onUploaded={(url) =>
                      handleDrawingUploaded(currentQuestion.id, url)
                    }
                    strokeColor="var(--fern-700)"
                    strokeWidth={4}
                  />
                </div>
                {drawingUrls[currentQuestion.id] && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      background: "rgba(76, 167, 111, 0.1)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "var(--fern-700)", fontWeight: 600 }}>
                      ✓
                    </span>
                    <span
                      style={{ color: "var(--text-700)", fontSize: "0.9rem" }}
                    >
                      Đã lưu bản vẽ của bạn
                    </span>
                  </div>
                )}
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
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="cta solid"
                  onClick={handleSubmit}
                  style={{ padding: "12px 24px" }}
                >
                  Nộp bài ✓
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

      <ResultPopup
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        score={score}
        total={questions.length}
        results={results}
      />
    </div>
  );
}

export default GamePage;
