# Server - Vietnamese Text Segmentation API

Server backend được xây dựng bằng Node.js và Express, cung cấp API cho ứng dụng trò chơi chữ viết với tích hợp xác thực người dùng và nhận dạng hình ảnh.

## Tính năng

- Xác thực người dùng (Authentication)
  - Đăng ký tài khoản mới
  - Đăng nhập với JWT token
  - Middleware bảo vệ routes
- Xử lý hình ảnh
  - Upload hình ảnh vẽ tay
  - Gửi đến AI model để nhận dạng
  - Trả về kết quả dự đoán
- Kết nối MongoDB để lưu trữ dữ liệu người dùng
- CORS được cấu hình cho cross-origin requests

## Công nghệ sử dụng

- Node.js
- Express 5.2.1
- MongoDB với Mongoose 9.0.1
- JWT (jsonwebtoken 9.0.3)
- Bcrypt (bcryptjs 3.0.3) cho mã hóa mật khẩu
- Multer 2.0.2 cho upload file
- dotenv 17.2.3 cho environment variables
- CORS 2.8.5

## Cấu trúc thư mục

```
server/
├── src/
│   ├── config/
│   │   └── db.config.js      # Cấu hình kết nối MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js    # Logic xác thực
│   │   └── pic.controller.js     # Logic xử lý ảnh
│   ├── middlewares/
│   │   └── verifyToken.middlewares.js  # Middleware JWT
│   ├── models/
│   │   └── user.model.js     # Schema người dùng
│   ├── routes/
│   │   ├── auth.route.js     # Routes xác thực
│   │   ├── pic.route.js      # Routes xử lý ảnh
│   │   └── index.route.js    # Root routes
│   └── app.js                # Express app configuration
├── server.js                 # Entry point
└── package.json
```

## Yêu cầu hệ thống

- Node.js phiên bản 16.x trở lên
- MongoDB đang chạy (local hoặc cloud)
- npm hoặc yarn

## Cài đặt

1. Di chuyển vào thư mục server:

```bash
cd server
```

2. Cài đặt các dependencies:

```bash
npm install
```

3. Tạo file `.env` trong thư mục server với các biến sau:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
AI_MODEL_URL=your_ai_model_api_url
```

## Sử dụng

### Chế độ phát triển (Development)

Khởi động server với nodemon (auto-reload):

```bash
npm run dev
```

### Chế độ production

Khởi động server cho môi trường production:

```bash
npm start
```

Server sẽ chạy tại port được chỉ định trong file `.env` (mặc định: 3000)

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Đăng ký người dùng mới
  - Body: `{ fullname, email, password }`
- **POST** `/api/auth/login` - Đăng nhập
  - Body: `{ email, password }`
  - Response: `{ token, user }`

### Image Processing

- **POST** `/api/pic/upload` - Upload và nhận dạng hình ảnh (yêu cầu authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: FormData với file ảnh
  - Response: Kết quả nhận dạng từ AI model

## Cấu hình Database

Server sử dụng MongoDB để lưu trữ:

- Thông tin người dùng (email, password đã hash, fullname)
- Thời gian tạo và cập nhật

Schema User:

```javascript
{
  fullname: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Bảo mật

- Mật khẩu được mã hóa bằng bcrypt trước khi lưu vào database
- JWT token được sử dụng cho authentication
- Middleware verifyToken bảo vệ các routes quan trọng
- CORS được cấu hình để chỉ cho phép origin được chỉ định

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi khởi động server
- File `.env` không được commit lên git (đã có trong .gitignore)
- Cần cấu hình đúng AI_MODEL_URL để tính năng nhận dạng hình ảnh hoạt động
- CORS origin mặc định là `http://localhost:5173`, thay đổi nếu client chạy ở port khác

## Xử lý lỗi

Server trả về các mã lỗi HTTP chuẩn:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
