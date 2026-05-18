/**
 * Exploring Module Routes
 * 
 * Routes for the game exploring/exploration feature.
 * Players can explore to find random items with cooldown mechanics.
 * 
 * @module exploring/routes
 */

// src/modules/game/exploring/exploring.routes.js
import express from "express";
import * as controller from "./exploring.controller.js";

const router = express.Router();

/**
 * POST /game/exploring
 * 
 * Execute an exploring action to find random items
 * 
 * Requires user authentication. Initiates an explore action which:
 * 1. Checks if user is on cooldown
 * 2. Selects random items from exploreable pool
 * 3. Adds items to user's inventory
 * 
 * @route GET /game/exploring
 * @access Private (Requires valid session cookie)
 * 
 * @returns {Object} 200 - Success response containing explored items
 * @returns {Object} 429 - Too Many Requests (cooldown active)
 * @returns {Object} 500 - Server error
 * 
 * @example
 * // Request
 * GET /game/exploring
 * Cookie: session_token=...
 * 
 * @example
 * // Success response (200)
 * {
 *   "explored_items": ["bronze_ore", "coal", "bronze_ore"],
 *   "grouped_items": {"bronze_ore": 2, "coal": 1},
 *   "inventory_update": {"updatedItems": 2}
 * }
 * 
 * @example
 * // Cooldown response (429)
 * {
 *   "error": "Exploring cooldown active",
 *   "retry_after_ms": 3500
 * }
 */
router.get("/", controller.doExploring);

export default router;