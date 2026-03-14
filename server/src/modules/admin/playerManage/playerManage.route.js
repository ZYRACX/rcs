import { Router } from "express";
import * as controller from "./playerManage.controller.js";


const router = Router();


// Define routes for item management

router.get("/:userId", controller.getUserDataByUserId)
router.get("/:userId/inventory", controller.getPlayerInventoryAdmin)

export default router;