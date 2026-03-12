import { Router } from "express";
import * as controller from "./userManager.controller.js";
const router = Router();

// Define routes for item management

router.get("/players", controller.getAllPlayers)

export default router;