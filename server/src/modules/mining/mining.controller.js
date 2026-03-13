import { request, response } from "express";
import { createAppwriteClient } from "../../utils/appwrite.js";
import RandomItemPicker from "../../utils/randomItemPicker.js";
import { extractSessionCookie } from "../../utils/SessionCookieExtractor.js";

import * as miningService from "./mining.service.js";

/**
 * Mining endpoint
 * Generates mined items and stores them in inventory
 * 
 * @param {request} req
 * @param {response} res
 */
export async function doMining(req, res) {

    try {

        const session = extractSessionCookie(req);

        const { account } = createAppwriteClient("user", session);
        const { tablesDB } = createAppwriteClient("admin");

        const user = await account.get();

        // Fetch mineable items
        const minableItems = await miningService.getMinableItems(tablesDB);

        // Random drop (100–500 items)
        const minedItems = RandomItemPicker(minableItems, 100, 500);
        // Count occurrences
        const sortedItems = await miningService.getSortedItems(minedItems);

        console.log("Sorted items: " + sortedItems)
        // Add to inventory
        const inventoryResult = await miningService.addToInventory(
            tablesDB,
            sortedItems,
            user.$id
        );

        return res.status(200).json({
            mined_items: minedItems,
            grouped_items: sortedItems,
            inventory_update: inventoryResult
        });

    } catch (error) {
        console.error("Mining error:", error);

        return res.status(500).json({
            error: "Mining failed"
        });
    }
}