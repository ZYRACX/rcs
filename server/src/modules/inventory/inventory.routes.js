// src/modules/auth/auth.routes.js
import express from "express";
import * as controller from "./inventory.controller.js";

const router = express.Router();

// 
router.get("/", controller.getPlayerInventory)



// 
// router.get("/discord/register", controller.discordAuth);

export default router;