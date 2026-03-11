import { createAppwriteClient, Query } from "../../utils/appwrite.js";
import appwriteConfig from "../../config/appwrite.js";
import { request, response } from "express";
import { extractSessionCookie } from "../../utils/SessionCookieExtractor.js";

/**
 * Get the authenticated player's inventory.
 *
 * This endpoint:
 * 1. Extracts the user's Appwrite session cookie
 * 2. Authenticates the user using Appwrite
 * 3. Fetches the player's inventory rows
 * 4. Fetches item metadata (name, value)
 * 5. Combines both datasets into a structured response
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 *
 * @returns {JSON} Example response:
 * {
 *   inventory: [
 *     {
 *       itemId: "stone",
 *       name: "Stone",
 *       quantity: 10,
 *       itemBaseValue: 2
 *     }
 *   ]
 * }
 */
export async function getPlayerInventory(req, res) {
    try {

        /**
         * Array that will contain the final formatted inventory items
         */
        const inventoryItems = [];

        /**
         * Extract Appwrite session cookie from request
         * This session is required to authenticate the user
         */
        const session = extractSessionCookie(req);

        /**
         * Create Appwrite clients
         *
         * user client → authenticated using session
         * admin client → authenticated using API key
         */
        const { account } = createAppwriteClient("user", session);
        const { tablesDB } = createAppwriteClient("admin");

        /**
         * Fetch the currently authenticated user
         */
        const user = await account.get();

        /**
         * Fetch all inventory rows belonging to the user
         * Each row represents an item entry in the player's inventory
         */
        const inventoryResult = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
            queries: [
                Query.equal("userId", user.$id)
            ]
        });

        /**
         * Fetch all item definitions from the ITEM_TABLE
         * This table contains metadata about items
         * Example:
         * - itemName
         * - base value
         * - other item attributes
         */
        const items = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.ITEM_TABLE,
        });

        /**
         * Iterate through player's inventory rows
         * and match them with their item definitions
         */
        for (let playerInventoryItem of inventoryResult.rows) {

            /**
             * Find the item metadata using itemId
             */
            const item = items.rows.find(
                item => item.$id === playerInventoryItem.itemId
            );

            /**
             * If item metadata exists, construct
             * a clean inventory object for the response
             */
            if (item) {

                inventoryItems.push({
                    itemId: playerInventoryItem.itemId,
                    name: item.itemName,
                    quantity: playerInventoryItem.amount,
                    itemBaseValue: item.itemBaseValue
                });

            }
        }

        /**
         * Return formatted inventory response
         */
        return res.status(200).json({
            inventory: inventoryItems
        });

    } catch (error) {

        /**
         * Log server error for debugging
         */
        console.error("Error fetching player inventory:", error);

        /**
         * Return generic error message to client
         */
        return res.status(500).json({
            error: "Failed to fetch player inventory"
        });

    }
}