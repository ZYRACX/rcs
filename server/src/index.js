import express, { json } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config()
import authRouter from './modules/auth/auth.routes.js';
import economyRouter from './modules/economy/economy.routes.js';
import playerInfoRouter from './modules/player/player.routes.js';
import inventoryRouter from './modules/inventory/inventory.route.js';
import miningRouter from './modules/mining/mine.routes.js';
import adminRouter from './modules/admin/admin.route.js';
// express app instance
const app = express();

// Database connection
// const db = require("./connection");

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Allow all origins
    credentials: true
};

// Middlewares
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.send('Hello World, Test!');
});

// Register route
app.use('/auth', authRouter);

app.use('/game/economy', economyRouter);
app.use('/game/playerinfo', playerInfoRouter);
app.use("/game/inventory", inventoryRouter)
app.use("/game/mining", miningRouter)

app.use("/admin", adminRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});