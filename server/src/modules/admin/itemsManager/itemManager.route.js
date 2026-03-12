import { Router } from "express";
import * as controller from "./itemManager.controller.js";
const router = Router();

// Define routes for item management

router.get("/", controller.getAllItems)
router.post("/item/add", controller.addItem)
router.put("/:itemId", controller.updateItem)
router.delete("/delete/:itemId", controller.deleteItem)

export default router;