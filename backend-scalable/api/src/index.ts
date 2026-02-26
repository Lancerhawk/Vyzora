import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002; // Default to 3002 for the scalable backend

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'scalable-api' });
});

// Placeholder for routes
app.get('/api/ping', (req, res) => {
    res.json({ message: 'Pong from scalable-api' });
});

app.listen(PORT, () => {
    console.log(`🚀 Scalable Backend API running on http://localhost:${PORT}`);
});
