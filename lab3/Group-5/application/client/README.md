# Client - Ứng dụng Trò chơi Chữ Viết

Ứng dụng web frontend được xây dựng bằng React, TypeScript và Vite, cung cấp giao diện người dùng cho trò chơi tương tác với nhận dạng chữ viết tay.

## Tính năng

- Đăng nhập và đăng ký người dùng
- Trang chủ với giới thiệu về trò chơi
- Trò chơi tương tác:
  - Trả lời câu hỏi bằng text
  - Vẽ câu trả lời trên bảng vẽ (Drawing Board)
  - Gửi hình ảnh vẽ tay để nhận dạng bởi AI
- Hiển thị kết quả sau khi hoàn thành
- Giao diện responsive và thân thiện

## Công nghệ sử dụng

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- React Router DOM 6.28.0
- ESLint cho code linting

## Cấu trúc thư mục

```
client/
├── public/
│   └── questions/        # File câu hỏi
├── src/
│   ├── components/       # Các component React
│   ├── layouts/          # Layout chính
│   ├── pages/            # Các trang chính
│   ├── utils/            # Utilities và helpers
│   ├── App.tsx           # Component root
│   └── main.tsx          # Entry point
└── package.json
```

## Yêu cầu hệ thống

- Node.js phiên bản 16.x trở lên
- npm hoặc yarn

## Cài đặt

1. Di chuyển vào thư mục client:

```bash
cd client
```

2. Cài đặt các dependencies:

```bash
npm install
```

## Sử dụng

### Chế độ phát triển (Development)

Khởi động development server với hot reload:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho production

Biên dịch ứng dụng cho môi trường production:

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Preview bản build

Xem trước bản build production:

```bash
npm run preview
```

### Lint code

Kiểm tra code với ESLint:

```bash
npm run lint
```

## Cấu hình

Ứng dụng kết nối với backend server thông qua API. Đảm bảo server đang chạy và cấu hình đúng URL trong file config.

Default API endpoint: `http://localhost:3000/api`

## Các trang chính

- **HomePage**: Trang chủ giới thiệu về trò chơi
- **LoginPage**: Trang đăng nhập
- **RegisterPage**: Trang đăng ký
- **GamePage**: Trang chơi game với bảng vẽ và câu hỏi

## Components quan trọng

- **DrawingBoard**: Component bảng vẽ cho phép người dùng vẽ câu trả lời
- **ResultPopup**: Hiển thị kết quả sau khi hoàn thành trò chơi
- **Header/Footer**: Layout components
- **Hero/Features**: Landing page components

## Lưu ý

- Đảm bảo server backend đã được khởi động trước khi chạy client
- File câu hỏi phải được đặt trong thư mục `public/questions/`
- Token đăng nhập được lưu trong localStorage
