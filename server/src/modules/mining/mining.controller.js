import { request, response } from "express";
import { createAppwriteClient } from "../../utils/appwrite.js";
import RandomItemPicker from "../../utils/randomItemPicker.js";
import { extractSessionCookie } from "../../utils/SessionCookieExtractor.js";
import * as miningService from "./mining.service.js";

export async function doMining(req, res) {

    try {

        const session = extractSessionCookie(req);

        const { account } = createAppwriteClient("user", session);
        const { tablesDB } = createAppwriteClient("admin");

        const user = await account.get();

        // Check cooldown
        const cooldownCheck = await miningService.checkMiningCooldown(
            tablesDB,
            user.$id
        );

        if (!cooldownCheck.allowed) {
            return res.status(429).json({
                error: "Mining cooldown active",
                retry_after_ms: cooldownCheck.remaining
            });
        }

        // 🚨 update timestamp immediately to prevent spam
        await miningService.updateMiningTimestamp(tablesDB, user.$id);

        // Fetch mineable items
        const minableItems = await miningService.getMinableItems(tablesDB);

        // Random drop
        const minedItems = RandomItemPicker(minableItems, 100, 500);

        // Group items
        const sortedItems = await miningService.getSortedItems(minedItems);

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