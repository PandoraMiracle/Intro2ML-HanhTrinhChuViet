**Giới Thiệu**
- **Mô tả**: Thư mục `lab 1` chứa ví dụ dự án dự đoán giá nhà sử dụng hồi quy tuyến tính và các kỹ thuật hồi quy mở rộng. Bao gồm code để chạy ứng dụng demo (Streamlit), notebook huấn luyện/phân tích, dữ liệu và các mô hình đã được train sẵn.

**Nội Dung Thư Mục**
- **File chính (ứng dụng demo)**: `app.py` — ứng dụng Streamlit cho phép thử nghiệm dự đoán giá nhà.
- **Notebooks**: `linear_regression.ipynb` (hoặc `linear_regresion.ipynb`) — notebook huấn luyện và phân tích mô hình hồi quy.
- **Dữ liệu**: `data_predict_price_hourse.csv` — tập dữ liệu mẫu dùng cho demo và huấn luyện.
- **Yêu cầu**: `requirement.txt` — danh sách package Python cần cài.
- **Mô hình đã train**: thư mục `Models/` chứa các file `.joblib` (ví dụ `house_price_LinearRegression_model.joblib`, `house_price_Lasso_model.joblib`, ...).

**Yêu Cầu (Requirements)**
- **Python**: khuyến nghị sử dụng Python 3.8+.
- **Cài đặt thư viện**: cài các gói trong `requirement.txt` trước khi chạy.

Chạy các lệnh trong PowerShell:
```powershell
pip install -r requirement.txt
streamlit run app.py
```

**Cách Chạy & Sử Dụng**
- Để chạy giao diện demo: thực hiện lệnh `streamlit run app.py` rồi mở đường dẫn được Streamlit in ra (thường là `http://localhost:8501`).
- Để xem hoặc chỉnh sửa quy trình huấn luyện: mở `linear_regression.ipynb` bằng Jupyter / VS Code.
- Nếu muốn dùng mô hình đã train trong mã Python, load file `.joblib` từ thư mục `Models/` bằng `joblib.load("Models/your_model.joblib")`.

**Ghi chú về dữ liệu & mô hình**
- Tập dữ liệu demo (`data_predict_price_hourse.csv`) là bản rút gọn để minh họa; kiểm tra và tiền xử lý dữ liệu trước khi huấn luyện lại mô hình.
- Các file trong `Models/` là mô hình đã train sẵn dùng cho demo — bạn có thể tái huấn luyện bằng notebook có sẵn nếu muốn cải thiện hiệu năng.

**Muốn chỉnh sửa hoặc mở rộng**
- Thêm tính năng: mở `app.py` và cập nhật giao diện/logic; nếu thêm dependencies, cập nhật `requirement.txt`.
- Huấn luyện lại mô hình: chạy notebook tương ứng, lưu mô hình mới vào `Models/` (định dạng `.joblib`).

**Liên hệ / Tham khảo**
- Nếu cần hỗ trợ hoặc muốn gợi ý cải tiến, để lại issue hoặc liên hệ người giữ repo.

---
Phiên bản README: cập nhật cho `lab 1` — hướng dẫn nhanh để chạy và phát triển tiếp.
