import { Router } from "express";
import upload from "../../../middleware/upload.js"
import * as controller from "./itemManager.controller.js";
const router = Router();

// Define routes for item management

router.get("/", controller.getAllItems)
router.post("/item/add", upload.single("itemImage"), controller.addItem)
router.put("/:itemId", upload.single("itemImage"), controller.updateItem)
router.delete("/delete/:itemId", controller.deleteItem)

export default router;