// src/modules/auth/auth.routes.js
import express from "express";
import * as controller from "./economy.controller.js";

const router = express.Router();

// 
router.get("/balance", controller.getBalance )


// 
// router.get("/discord/register", controller.discordAuth);

export default router;