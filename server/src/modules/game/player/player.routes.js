// src/modules/auth/auth.routes.js
import express from "express";
import * as controller from "./player.controller.js";

const router = express.Router();

// 
router.get("/", controller.getPlayerStats)



// 
// router.get("/discord/register", controller.discordAuth);

export default router;