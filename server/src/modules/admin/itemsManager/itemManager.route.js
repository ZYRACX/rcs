import { Router } from "express";
import * as controller from "./itemManager.controller.js";
const router = Router();

// Define routes for item management

router.get("/", controller.getAllItems)

export default router;