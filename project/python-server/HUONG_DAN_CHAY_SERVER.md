# Hướng dẫn chạy Python Server

## ⚠️ Lưu ý: Nếu lỗi "python is not recognized"

Nếu gặp lỗi `'python' is not recognized`, bạn có thể:

**Cách 1: Dùng đường dẫn đầy đủ đến Python (Anaconda)**
```bash
C:\Users\tramvo\anaconda3\python.exe app.py
```

**Cách 2: Thêm Anaconda vào PATH (khuyến nghị)**
- Mở "Environment Variables" trong Windows
- Thêm `C:\Users\tramvo\anaconda3` và `C:\Users\tramvo\anaconda3\Scripts` vào PATH
- Hoặc dùng Anaconda Prompt (đã có sẵn PATH)

**Cách 3: Dùng Anaconda Prompt**
- Mở "Anaconda Prompt" từ Start Menu
- Python sẽ hoạt động ngay

---

## Cách 1: Chạy trực tiếp (nếu đã cài đặt dependencies)

```bash
# Di chuyển vào thư mục python-server
cd project\python-server

# Chạy server (dùng đường dẫn đầy đủ nếu python không được nhận diện)
python app.py
# Hoặc
C:\Users\tramvo\anaconda3\python.exe app.py
```

Server sẽ chạy tại: `http://0.0.0.0:5000` hoặc `http://localhost:5000`

---

## Cách 2: Sử dụng Anaconda Environment (Khuyến nghị cho Anaconda users)

```bash
# Di chuyển vào thư mục python-server
cd project\python-server

# Tạo conda environment mới
conda create -n ocr_server python=3.11 -y

# Kích hoạt environment
conda activate ocr_server

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
python app.py
```

---

## Cách 3: Sử dụng Virtual Environment (venv)

### Bước 1: Tạo Virtual Environment

```bash
# Di chuyển vào thư mục python-server
cd project\python-server

# Tạo virtual environment
python -m venv .venv
```

### Bước 2: Kích hoạt Virtual Environment

**Trên Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**Trên Windows (CMD):**
```cmd
.venv\Scripts\activate.bat
```

**Trên Linux/Mac:**
```bash
source .venv/bin/activate
```

### Bước 3: Cài đặt Dependencies

```bash
# Nâng cấp pip
python -m pip install --upgrade pip

# Cài đặt các package cần thiết
pip install -r requirements.txt
```

### Bước 4: Chạy Server

```bash
python app.py
```

---

## Kiểm tra Server đã chạy

Sau khi chạy, bạn sẽ thấy output tương tự:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### Test server:

**1. Kiểm tra health endpoint:**
```bash
curl http://localhost:5000/
```

Hoặc mở trình duyệt và truy cập: `http://localhost:5000/`

**2. Test OCR endpoint:**
```bash
curl -X POST -F "image=@path/to/your/image.png" http://localhost:5000/predict
```

---

## Dừng Server

Nhấn `Ctrl + C` trong terminal để dừng server.

---

## Lưu ý

- Server chạy ở chế độ **debug=True**, tự động reload khi code thay đổi
- Port mặc định: **5000**
- Nếu port 5000 đã được sử dụng, bạn có thể đổi port trong `app.py`:
  ```python
  app.run(host="0.0.0.0", port=8080, debug=True)  # Đổi port thành 8080
  ```

---

## Troubleshooting

### Lỗi: ModuleNotFoundError
- Đảm bảo đã kích hoạt virtual environment
- Kiểm tra đã cài đặt đủ dependencies: `pip install -r requirements.txt`

### Lỗi: Port already in use
- Đổi port trong `app.py` hoặc dừng process đang dùng port 5000

### Lỗi: Permission denied (Linux/Mac)
- Thử chạy với quyền admin hoặc đổi port

### Lỗi: 'python' is not recognized
- Dùng đường dẫn đầy đủ: `C:\Users\tramvo\anaconda3\python.exe`
- Hoặc mở Anaconda Prompt thay vì CMD/PowerShell thông thường
- Hoặc thêm Anaconda vào PATH trong Environment Variables

---

## Cách 4: Chạy trên WSL (Windows Subsystem for Linux)

Nếu bạn muốn dùng môi trường Linux:

```bash
# Mở WSL terminal
wsl

# Di chuyển vào thư mục (đường dẫn WSL)
cd /mnt/d/HCMUS/Semester7/ML/Intro2ML-HanhTrinhChuViet/project/python-server

# Tạo virtual environment
python3 -m venv .venv

# Kích hoạt
source .venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
python app.py
```

**Lưu ý khi dùng WSL:**
- Đường dẫn file sẽ khác: `/mnt/d/...` thay vì `D:\...`
- Cần cài Python3 trên WSL: `sudo apt update && sudo apt install python3 python3-pip python3-venv`
- Server chạy trên WSL vẫn có thể truy cập từ Windows browser qua `http://localhost:5000`

