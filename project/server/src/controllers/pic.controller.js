const FLASK_SERVER_URL = "http://localhost:5000";

export const uploadPic = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.json({
      success: false,
      message: "Không có tệp tin được tải lên.",
    });
  }

  try {
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([file.buffer], { type: file.mimetype }),
      file.originalname
    );

    console.log(`Gửi request tới: ${FLASK_SERVER_URL}/predict`);

    const flaskResponse = await fetch(`${FLASK_SERVER_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    const data = await flaskResponse.json();
    console.log(data);

    if (!flaskResponse.ok) {
      return res.json({
        success: false,
        message: data.error || "Đã xảy ra lỗi từ dịch vụ xử lý ảnh.",
      });
    }

    // Extract OCR text from Flask response for compatibility with DrawingBoard
    const ocrText = data.text || data.ocr_text || data.predicted_text || "";

    return res.json({
      success: true,
      data: data,
      // Also include ocr_text at root level for DrawingBoard compatibility
      ocr_text: ocrText,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Đã xảy ra lỗi khi tải lên tệp tin.",
    });
  }
};

// Recognize endpoint - returns OCR text in format expected by DrawingBoard
export const recognize = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.json({
      success: false,
      message: "Không có tệp tin được tải lên.",
      ocr_text: "",
    });
  }

  try {
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([file.buffer], { type: file.mimetype }),
      file.originalname
    );

    console.log(`Gửi request tới: ${FLASK_SERVER_URL}/predict`);

    const flaskResponse = await fetch(`${FLASK_SERVER_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json().catch(() => ({}));
      return res.json({
        success: false,
        message: errorData.error || "Đã xảy ra lỗi từ dịch vụ xử lý ảnh.",
        ocr_text: "",
      });
    }

    const data = await flaskResponse.json();
    console.log("Flask response:", data);

    // Extract OCR text from Flask response
    // Flask server might return: { text: "...", ... } or { ocr_text: "...", ... }
    const ocrText = data.text || data.ocr_text || data.predicted_text || "";

    // Return in format expected by DrawingBoard
    return res.json({
      success: true,
      ocr_text: ocrText,
      data: {
        ocr_text: ocrText,
        ...data,
      },
    });
  } catch (error) {
    console.error("Error in recognize:", error);
    return res.json({
      success: false,
      message: "Đã xảy ra lỗi khi nhận dạng văn bản.",
      ocr_text: "",
    });
  }
};