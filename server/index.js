const express = require('express');
const cors = require('cors');
const mysql = require("mysql2")
const bcrypt = require("bcrypt")

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
app.use(express.json());
const PORT = process.env.PORT || 8000;




app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Register route
app.use('/api/register', require('./routers/auth/register-router'));

// Login route
app.use('/api/login', require('./routers/auth/login-router'));

// Game route
app.use('/api/game', require('./routers/game/game-router'));

// Inventory route

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});