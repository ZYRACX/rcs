// src/modules/auth/auth.routes.js

import express from "express";
import * as controller from "./auth.controller.js";

const router = express.Router();

// 
router.post("/register", controller.WebRegisterController);

//
router.post("/login", controller.WebLoginController);

// 
router.get("/discord/register", controller.discordAuth);

export default router;