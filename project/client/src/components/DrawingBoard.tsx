import { useEffect, useRef, useState } from "react";

type Props = {
  onSave?: (imageData: string) => void;
  onUploaded?: (url: string, result?: any) => void;
  uploadUrl?: string;
  strokeColor?: string;
  strokeWidth?: number;
  expectedAnswer?: string; // Expected answer to compare with OCR result
  onMatchResult?: (isMatched: boolean, userAnswer: string, expectedAnswer: string) => void;
};

const DrawingBoard = ({
  onSave,
  onUploaded,
  uploadUrl = "/api/pic/upload",
  strokeColor = "#000000",
  strokeWidth = 3,
  expectedAnswer,
  onMatchResult,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{
    isMatched: boolean;
    userAnswer: string;
    expectedAnswer: string;
  } | null>(null);

  // Fit canvas to parent size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 600;
      const h = parent?.clientHeight ?? 250;
      canvas.width = w;
      canvas.height = h;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const startDraw = (x: number, y: number) => {
    const ctx = getCtx();
    if (!ctx) return;
    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (x: number, y: number) => {
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const getPos = (e: TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e instanceof TouchEvent) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getPos(e.nativeEvent);
    startDraw(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getPos(e.nativeEvent);
    draw(x, y);
  };

  const handleMouseUp = () => endDraw();

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getPos(e.nativeEvent);
    startDraw(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getPos(e.nativeEvent);
    draw(x, y);
  };

  const handleTouchEnd = () => endDraw();

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Tạo canvas mới với nền trắng để gửi BE
    const uploadCanvas = document.createElement("canvas");
    // Giảm kích cỡ ảnh (50% kích cỡ gốc)
    uploadCanvas.width = canvas.width * 0.5;
    uploadCanvas.height = canvas.height * 0.5;
    const uploadCtx = uploadCanvas.getContext("2d");
    if (uploadCtx) {
      uploadCtx.fillStyle = "#ffffff";
      uploadCtx.fillRect(0, 0, uploadCanvas.width, uploadCanvas.height);

      // Đặt màu vẽ thành trắng (#ffffff) để gửi BE
      uploadCtx.strokeStyle = "#ffffff";
      uploadCtx.lineWidth = strokeWidth * 0.5;
      uploadCtx.lineCap = "round";

      // Scale canvas khi vẽ để lấy ảnh nhỏ hơn
      uploadCtx.scale(0.5, 0.5);
      uploadCtx.drawImage(canvas, 0, 0);
    }

    const imageData = canvas.toDataURL("image/png");
    if (onSave) onSave(imageData);

    if (!uploadUrl) return;

    setIsUploading(true);
    setUploadMsg(null);

    try {
      // Convert canvas to blob and upload
      const blobPromise = new Promise<Blob>((resolve) => {
        uploadCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });

      const blob = await blobPromise;
      console.log("Blob size:", blob.size, "bytes");

      // Create FormData
      const formData = new FormData();
      formData.append("image", blob, "drawing.png");

      // Debug: kiểm tra FormData entries
      for (const [key, value] of formData.entries()) {
        console.log("FormData entry:", key, value);
      }

      console.log("Gửi ảnh tới:", uploadUrl);

      const resp = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = (await resp.json()) as {
        url?: string;
        message?: string;
        success?: boolean;
        error?: string;
        // Direct OCR response format
        ocr_text?: string;
        model_used?: string;
        // Nested data format
        data?: {
          message?: string;
          model_used?: string;
          num_boxes?: number;
          ocr_text?: string;
          details?: any[];
        };
      };
      console.log("Response từ server:", data);

      // Check for error
      if (!resp.ok || data.error) {
        throw new Error(data.error || data.message || "Upload không thành công");
      }

      // Get OCR result - support both direct and nested format
      const ocrResult = data.ocr_text || data.data?.ocr_text || "";
      if (onUploaded) onUploaded(ocrResult || "uploaded", data);

      // Compare with expected answer if provided
      if (expectedAnswer) {
        const normalizedUserAnswer = ocrResult.trim().toLowerCase();
        const normalizedExpected = expectedAnswer.trim().toLowerCase();

        // First, try exact match (case-insensitive)
        let isMatched = normalizedUserAnswer === normalizedExpected;

        // If not exact match, check for partial matches (for cases like "A a" vs "A" or "a")
        if (!isMatched) {
          // Split expected by spaces to get individual parts (e.g., "A a" -> ["a", "a"])
          const expectedParts = normalizedExpected.split(/\s+/).filter(p => p.length > 0);

          // Check if user answer matches any of the expected parts exactly
          // This handles "A a" where user might write just "A" or "a"
          const matchesAnyPart = expectedParts.some(part => {
            // Exact match with a part
            if (normalizedUserAnswer === part) return true;

            // Check if user answer contains the part as a complete word (not substring)
            // Use word boundary to avoid "TATE" matching "A"
            const wordBoundaryRegex = new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return wordBoundaryRegex.test(ocrResult);
          });

          // Also check if user answer is a substring of expected (for "A" matching "A a")
          const isSubstring = normalizedExpected.includes(normalizedUserAnswer) &&
            normalizedUserAnswer.length > 0 &&
            normalizedUserAnswer.length <= normalizedExpected.length;

          // Match if user answer matches any part OR is a substring of expected
          isMatched = matchesAnyPart || isSubstring;

          // Additional strict check: if expected is very short (1-2 chars), require exact or very close
          if (normalizedExpected.length <= 2 && !isMatched) {
            // For single/double character expected, only match if user answer is the same length or shorter
            // and contains the expected character(s)
            const expectedUniqueChars = [...new Set(normalizedExpected.replace(/\s+/g, '').split(''))];
            const userUniqueChars = [...new Set(normalizedUserAnswer.replace(/\s+/g, '').split(''))];

            // Match only if all expected characters are present in user answer
            // AND user answer is not significantly longer (avoid "TATE" matching "A")
            const allCharsPresent = expectedUniqueChars.every(char => userUniqueChars.includes(char));
            const notTooLong = normalizedUserAnswer.length <= normalizedExpected.length + 1;

            isMatched = allCharsPresent && notTooLong;
          }
        }

        const result = {
          isMatched,
          userAnswer: ocrResult || "No text detected",
          expectedAnswer: expectedAnswer,
        };

        setMatchResult(result);

        if (onMatchResult) {
          onMatchResult(isMatched, ocrResult || "", expectedAnswer);
        }

        if (isMatched) {
          setUploadMsg("✅ Correct!");
        } else {
          setUploadMsg(`❌ Not matched. Expected: "${expectedAnswer}"`);
        }
      } else {
        setUploadMsg(ocrResult ? `OCR: ${ocrResult}` : 'Đã upload thành công');
      }
    } catch (err) {
      console.error("Lỗi upload:", err);
      setUploadMsg((err as Error).message || "Lỗi upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setMatchResult(null);
    setUploadMsg(null);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        height: "250px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid #e0ecd7",
          touchAction: "none",
          width: "100%",
          height: "100%",
          background: "#fffef6",
          borderRadius: 12,
          boxShadow: "0 10px 24px rgba(24, 74, 53, 0.08)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={handleClear}
            className="cta ghost"
            style={{ padding: "8px 14px" }}
            type="button"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="cta solid"
            style={{ padding: "8px 14px" }}
            type="button"
            disabled={isUploading}
          >
            {isUploading ? "Checking..." : "Check Answer"}
          </button>
        </div>
        {matchResult && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: matchResult.isMatched ? "#dcfce7" : "#fee2e2",
            border: `2px solid ${matchResult.isMatched ? "#16a34a" : "#dc2626"}`,
            fontSize: "0.9rem",
            minWidth: "250px",
            textAlign: "left",
            marginTop: "8px"
          }}>
            <div style={{
              fontWeight: "700",
              marginBottom: "8px",
              fontSize: "1rem",
              color: matchResult.isMatched ? "#16a34a" : "#dc2626"
            }}>
              {matchResult.isMatched ? "✅ Correct!" : "❌ Not Matched"}
            </div>
            <div style={{ color: "#1f3c32", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "4px" }}>
                <strong>Your answer:</strong> {matchResult.userAnswer || "No text detected"}
              </div>
              <div>
                <strong>Expected:</strong> {matchResult.expectedAnswer}
              </div>
            </div>
          </div>
        )}
        {uploadMsg && !matchResult && (
          <span
            style={{
              fontSize: "0.9rem",
              color: "#1f3c32",
              fontWeight: "500",
              padding: "4px 12px",
              borderRadius: "6px",
              background: "#f3f4f6",
              marginTop: "8px"
            }}
          >
            {uploadMsg}
          </span>
        )}
      </div>
    </div>
  );
};

export default DrawingBoard;
