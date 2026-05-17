import { createAppwriteClient, Query } from "../../../utils/appwrite.js";
import appwriteConfig from "../../../config/appwrite.js";
import { extractSessionCookie } from "../../../utils/SessionCookieExtractor.js";
import * as inventoryService from "./inventory.service.js";

/**
 * Helper function to generate static Appwrite Storage Preview URLs
 */
function getAppwriteImageUrl(fileId) {
    if (!fileId) return "";
    return `${appwriteConfig.appwrite.ENDPOINT}/storage/buckets/${appwriteConfig.appwrite.BUCKET_ITEMS_ID}/files/${fileId}/preview?project=${appwriteConfig.appwrite.PROJECT_ID}`;
}

/**
 * Get the authenticated player's inventory with image assets.
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 *
 * @returns {JSON} Example response:
 * {
 *   inventory: [
 *     {
 *       itemId: "6999db13003a92979158",
 *       name: "Stone",
 *       quantity: 10,
 *       itemBaseValue: 2,
 *       itemImageUrl: "https://cloud.appwrite.io/v1/storage/buckets/.../preview?project=..."
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
         */
        const session = extractSessionCookie(req);

        /**
         * Create Appwrite clients
         */
        const { account } = createAppwriteClient("user", session);
        const { tablesDB } = createAppwriteClient("admin");

        /**
         * Fetch the currently authenticated user
         */
        const user = await account.get();

        /**
         * Fetch all inventory rows belonging to the user
         */
        const inventoryResult = await inventoryService.getPlayerInventory(user.$id, tablesDB);

        /**
         * Fetch all item definitions from the ITEM_TABLE
         */
        const itemsResult = await inventoryService.getItems(tablesDB);

        /**
         * Iterate through player's inventory rows
         * and match them with their item definitions
         */
        for (let playerInventoryItem of inventoryResult.rows) {

            /**
             * Find the item metadata using itemId
             */
            const item = itemsResult.rows.find(
                item => item.$id === playerInventoryItem.itemId
            );

            /**
             * If item metadata exists, construct a clean inventory object 
             * including the dynamic Appwrite storage URL link.
             */
            if (item) {
                inventoryItems.push({
                    itemId: playerInventoryItem.itemId,
                    name: item.itemName,
                    quantity: playerInventoryItem.amount,
                    itemBaseValue: item.itemBaseValue,
                    itemImageUrl: getAppwriteImageUrl(item.$id) // 🌟 Attaching the dynamic file link
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