import express, { json } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config()
import authRouter from './modules/auth/auth.routes.js';
// express app instance
const app = express();

// Database connection
// const db = require("./connection");

// CORS configuration
const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};

// Middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(json());
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
    let trackerId = req.cookies.tracker_id;
    if (!trackerId) {
        trackerId = GenerateTrackerID();
        res.cookie('tracker_id', trackerId, { 
            httpOnly: true, 
            sameSite: 'strict' 
        });
    }
    console.log("Tracker ID:", trackerId);
    req.trackerId = trackerId;
    next();
});


app.get('/', (req, res) => {
    res.send('Hello World, Test!');
});

// Register route
app.use('/auth', authRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});