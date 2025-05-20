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
const port = 8080;

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 40,
    message: 'Too many requests, please try again later.',
});

const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'https://project-frontend-delta-self.vercel.app',
        'https://project-backend-liard.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    exposedHeaders: ['Access-Control-Allow-Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(limiter);

app.get('/',(req,res)=>{
    return res.status(200).json({
        status:true,
        message:"req is valid"
    })
})

app.use('/user',userRoutes);
app.use('/clubs',clubRoutes); 
app.use('/event',eventRoutes);
app.use('/student',studentRoutes);


app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: "404 Not Found - The requested route does not exist",
    });
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err.message,
    });
});



app.listen(port,()=>{
    console.log("the project is working on port : ",port); 
})