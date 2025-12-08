import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import indexRoute from './routes/index.route.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.use('/', indexRoute);

export default app;