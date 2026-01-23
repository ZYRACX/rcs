import express, { json } from 'express';
import cors from 'cors';
import bcrypt from "bcrypt";

import registerRouter from './routers/auth/register-router.js';
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
app.use(cors(corsOptions));
app.use(json());
const PORT = process.env.PORT || 8000;




app.get('/', (req, res) => {
    res.send('Hello, World Test!');
});

// Register route
app.use('/api/register', registerRouter);

// Login route
app.use('/api/login', require('./routers/auth/login-router'));

// Game route
app.use('/api/game', require('./routers/game/game-router'));

// Admin route
app.use('/api/admin', require('./routers/admin/admin-router'));
app.use('/api/admin/items', require('./routers/admin/items'));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});