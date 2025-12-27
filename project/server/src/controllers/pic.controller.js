<<<<<<< HEAD
=======
const FLASK_SERVER_URL = "http://localhost:5000";

>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c
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

<<<<<<< HEAD
    const flaskResponse = await fetch("http://localhost:5000/predict", {
=======
    console.log(`Gửi request tới: ${FLASK_SERVER_URL}/predict`);

    const flaskResponse = await fetch(`${FLASK_SERVER_URL}/predict`, {
>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c
      method: "POST",
      body: formData,
    });

    const data = await flaskResponse.json();
<<<<<<< HEAD
=======
    console.log(data);
>>>>>>> c297edae90a43f457d0bc4ab8fd7e980543ef57c

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