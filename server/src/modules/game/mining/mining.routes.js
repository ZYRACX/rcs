// src/modules/auth/auth.routes.js
import express from "express";
import * as controller from "./mining.controller.js";

const router = express.Router();

// 
router.get("/", controller.doMining);



// 
// router.get("/discord/register", controller.discordAuth);

export default router;