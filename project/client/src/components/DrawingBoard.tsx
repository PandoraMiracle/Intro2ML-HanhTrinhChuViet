import { useEffect, useRef, useState } from "react";

type Props = {
  onSave?: (imageData: string) => void;
  onUploaded?: (url: string, result?: any) => void;
  uploadUrl?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

const DrawingBoard = ({
  onSave,
  onUploaded,
  uploadUrl = "/api/pic/upload",
  strokeColor = "#000000",
  strokeWidth = 3,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

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
        data?: {
          message?: string;
          model_used?: string;
          num_boxes?: number;
          ocr_text?: string;
          details?: any[];
        };
      };
      console.log("Response từ server:", data);

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "Upload không thành công");
      }

      // Truyền URL (hoặc empty string) và kết quả OCR từ Flask
      const ocrResult = data.data?.ocr_text || "";
      if (onUploaded) onUploaded(ocrResult || "uploaded", data.data);
      // setUploadMsg(ocrResult ? `OCR: ${ocrResult}` : 'Đã upload thành công')
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
          alignItems: "center",
        }}
      >
        <button
          onClick={handleClear}
          className="cta ghost"
          style={{ padding: "8px 14px" }}
          type="button"
        >
          Xóa
        </button>
        <button
          onClick={handleSave}
          className="cta solid"
          style={{ padding: "8px 14px" }}
          type="button"
          disabled={isUploading}
        >
          {isUploading ? "Đang lưu..." : "Lưu"}
        </button>
        {uploadMsg && (
          <span style={{ fontSize: "0.9rem", color: "#1f3c32" }}>
            {uploadMsg}
          </span>
        )}
      </div>
    </div>
  );
};

export default DrawingBoard;
