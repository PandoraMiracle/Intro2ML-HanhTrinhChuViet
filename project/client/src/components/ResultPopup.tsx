import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  score: number;
  total: number;
  results: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
};

function ResultPopup({ isOpen, onClose, onRetry, score, total, results }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("popup-open");
      return () => {
        document.body.classList.remove("popup-open");
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const percentage = Math.round((score / total) * 100);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 42, 36, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="auth-card"
        style={{
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 style={{ marginTop: 0 }}>
            🎯 Kết quả: {score}/{total} điểm ({percentage}%)
          </h2>

          <div
            style={{
              margin: "20px 0",
              padding: "16px",
              borderRadius: 12,
              background:
                percentage >= 80
                  ? "linear-gradient(135deg, rgba(76, 167, 111, 0.15), rgba(143, 217, 180, 0.2))"
                  : percentage >= 50
                  ? "linear-gradient(135deg, rgba(246, 240, 179, 0.3), rgba(248, 209, 163, 0.2))"
                  : "linear-gradient(135deg, rgba(248, 200, 216, 0.2), rgba(247, 194, 125, 0.15))",
              border: `1px solid ${
                percentage >= 80
                  ? "rgba(76, 167, 111, 0.3)"
                  : percentage >= 50
                  ? "rgba(246, 240, 179, 0.4)"
                  : "rgba(248, 200, 216, 0.3)"
              }`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-900)",
              }}
            >
              {percentage >= 80
                ? "🌟 Xuất sắc! Bạn đã nắm vững kiến thức!"
                : percentage >= 50
                ? "👍 Tốt lắm! Tiếp tục cố gắng nhé!"
                : "💪 Đừng nản, hãy ôn tập và thử lại!"}
            </p>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "1.1rem",
                color: "var(--text-700)",
              }}
            >
              Chi tiết câu trả lời:
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              {results.map((result, index) => (
                <div
                  key={index}
                  style={{
                    padding: "12px",
                    borderRadius: 12,
                    background: result.isCorrect
                      ? "rgba(76, 167, 111, 0.08)"
                      : "rgba(248, 200, 216, 0.1)",
                    border: `1px solid ${
                      result.isCorrect
                        ? "rgba(76, 167, 111, 0.2)"
                        : "rgba(248, 200, 216, 0.3)"
                    }`,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontWeight: 600,
                      color: "var(--text-700)",
                    }}
                  >
                    Câu {index + 1}: {result.question}
                  </p>
                  <div
                    style={{ display: "grid", gap: "4px", fontSize: "0.9rem" }}
                  >
                    <p style={{ margin: 0, color: "var(--text-500)" }}>
                      <strong>Câu trả lời của bạn:</strong>{" "}
                      <span
                        style={{
                          color: result.isCorrect ? "var(--fern-700)" : "#c33",
                        }}
                      >
                        {result.userAnswer || "(Chưa trả lời)"}
                      </span>
                    </p>
                    {!result.isCorrect && result.correctAnswer !== "(Không có đáp án cố định)" && (
                      <p style={{ margin: 0, color: "var(--fern-700)" }}>
                        <strong>Đáp án đúng:</strong> {result.correctAnswer}
                      </p>
                    )}
                    {result.explanation && (
                      <p style={{ margin: "4px 0 0", color: "var(--text-600)", fontStyle: "italic" }}>
                        <strong>Giải thích:</strong> {result.explanation}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontWeight: 600,
                        color: result.isCorrect ? "var(--fern-700)" : "#c33",
                      }}
                    >
                      {result.isCorrect ? "✓ Đúng" : "✗ Sai"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            {onRetry && (
              <button className="cta solid" onClick={onRetry}>
                Làm bài mới
              </button>
            )}
            <button className="cta ghost" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPopup;
