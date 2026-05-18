import { createAppwriteClient }
    from "../../../utils/appwrite.js";

import RandomItemPicker
    from "../../../utils/randomItemPicker.js";

import { extractSessionCookie }
    from "../../../utils/SessionCookieExtractor.js";

import * as exploringService
    from "./exploring.service.js";

/**
 * Handles the exploring game action for authenticated users
 * 
 * Performs the following steps:
 * 1. Validates user session and retrieves authentication
 * 2. Checks if the user is on cooldown from their last explore action
 * 3. Updates the user's last explore timestamp
 * 4. Fetches all items marked as exploreable from the database
 * 5. Randomly selects items based on weighted probabilities (100-500 items)
 * 6. Groups and counts the selected items
 * 7. Adds the items to the user's inventory
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers containing session cookie
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response containing:
 *   - 429 status: If cooldown is active with retry_after_ms
 *   - 200 status: Successful explore with explored_items, grouped_items, inventory_update
 *   - 500 status: Server error during exploration
 * 
 * @throws {Error} Session extraction fails or Appwrite operations fail
 * 
 * @example
 * // Successful response
 * GET /game/exploring
 * {
 *   "explored_items": ["item1", "item2", "item1", ...],
 *   "grouped_items": { "item1": 5, "item2": 3 },
 *   "inventory_update": { "updatedItems": 2 }
 * }
 * 
 * @example
 * // Cooldown response
 * GET /game/exploring
 * Status: 429
 * {
 *   "error": "Exploring cooldown active",
 *   "retry_after_ms": 3500
 * }
 */
export async function doExploring( req, res) {
    try {
        const session = extractSessionCookie(req);

        const { account } = createAppwriteClient(
                "user",
                session
            );

        const { tablesDB } =
            createAppwriteClient("admin");

        const user =
            await account.get();

        const cooldownCheck =
            await exploringService.checkExploringCooldown(
                tablesDB,
                user.$id
            );

        if (!cooldownCheck.allowed) {
            return res.status(429).json({
                error:
                    "Exploring cooldown active",

                retry_after_ms:
                    cooldownCheck.remaining,
            });
        }

        await exploringService.updateExploringTimestamp(
            tablesDB,
            user.$id
        );

        const exploreableItems =
            await exploringService.getExploreableItems(
                tablesDB
            );

        const exploredItems =
            RandomItemPicker(
                exploreableItems,
                100,
                500
            );

        const sortedItems =
            await exploringService.getSortedItems(
                exploredItems
            );

        const inventoryResult =
            await exploringService.addToInventory(
                tablesDB,
                sortedItems,
                user.$id
            );

        return res.status(200).json({
            explored_items:
                exploredItems,

            grouped_items:
                sortedItems,

            inventory_update:
                inventoryResult,
        });
    } catch (error) {
        console.error(
            "Exploring error:",
            error
        );

        return res.status(500).json({
            error: "Exploring failed",
        });
    }
}