// src/modules/auth/auth.routes.js
import express from "express";
import * as controller from "./exploring.controller.js";

const router = express.Router();

// 
router.get("/", controller.doExploring);



// 
// router.get("/discord/register", controller.discordAuth);

export default router;