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

    const flaskResponse = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await flaskResponse.json();

    if (!flaskResponse.ok) {
      return res.json({
        success: false,
        message: data.error || "Đã xảy ra lỗi từ dịch vụ xử lý ảnh.",
      });
    }

    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Đã xảy ra lỗi khi tải lên tệp tin.",
    });
  }
};