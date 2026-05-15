import express from "express";

import * as controller
from "./market.controller.js";

const router = express.Router();

router.get("/listings",controller.getListings);

router.post("/list",controller.createListing);

router.post("/buy/:listingId",controller.buyListing);

export default router;