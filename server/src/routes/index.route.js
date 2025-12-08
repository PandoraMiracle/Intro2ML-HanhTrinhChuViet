import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

router.get('/', (req, res) => {
    res.send('API Hành trình Tiếng Việt');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
        }

        // TODO: Thay bằng logic xác thực thật (database, JWT, etc.)
        // Hiện tại chỉ demo: chấp nhận bất kỳ email/password nào
        if (email && password) {
            return res.status(200).json({
                message: 'Đăng nhập thành công',
                user: {
                    email,
                    name: email.split('@')[0],
                },
                token: 'demo-token-' + Date.now(),
            });
        }

        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
    }
});

router.post('/upload-base64', async (req, res) => {
    try {
        const { image } = req.body || {};
        if (!image || typeof image !== 'string') {
            return res.status(400).json({ message: 'Thiếu image base64' });
        }

        const match = image.match(/^data:image\/png;base64,(.+)$/);
        if (!match) {
            return res.status(400).json({ message: 'Định dạng không hợp lệ, cần PNG base64 data URL' });
        }

        await fs.mkdir(uploadsDir, { recursive: true });
        const buffer = Buffer.from(match[1], 'base64');
        const filename = `drawing-${Date.now()}.png`;
        const filepath = path.join(uploadsDir, filename);
        await fs.writeFile(filepath, buffer);

        return res.status(201).json({
            message: 'Đã lưu ảnh',
            url: `/uploads/${filename}`,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server khi lưu ảnh' });
    }
});

export default router;