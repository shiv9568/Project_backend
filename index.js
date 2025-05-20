import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import studentRoutes from './routes/studentroutes.js';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// ---- CORS SETUP ---- //
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://project-frontend-delta-self.vercel.app',
        'https://project-backend-liard.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Handles CORS for all requests
app.options('*', cors(corsOptions)); // Handles CORS preflight OPTIONS request

// ---- SECURITY & RATE LIMITING ---- //
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 40, // limit each IP to 40 requests per windowMs
    message: 'Too many requests, please try again later.',
});
app.use(limiter);

// ---- BODY PARSING ---- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ROUTES ---- //
app.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: "req is valid"
    });
});

app.use('/user', userRoutes);
app.use('/clubs', clubRoutes);
app.use('/event', eventRoutes);
app.use('/student', studentRoutes);

// ---- 404 HANDLER ---- //
app.use((req, res) => {
    res.status(404).json({
        status: false,
        message: "404 Not Found - The requested route does not exist",
    });
});

// ---- ERROR HANDLER ---- //
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err.message,
    });
});

// ---- START SERVER ---- //
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
