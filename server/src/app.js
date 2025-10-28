import express from 'express';
import cors from 'cors';

import indexRoute from './routes/index.route.js';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

app.use('/', indexRoute);

export default app;