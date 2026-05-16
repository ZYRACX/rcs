import express from "express";

import * as marketController
from "./market.controller.js";

const router = express.Router();

/**
 * Get all active listings
 */
router.get(
    "/listings",
    marketController.getListings
);

/**
 * Create market listing
 */
router.post(
    "/list",
    marketController.createListing
);

/**
 * Buy listing
 */
router.post(
    "/buy/:listingId",
    marketController.buyListing
);

export default router;