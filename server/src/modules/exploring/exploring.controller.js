import { createAppwriteClient }
    from "../../utils/appwrite.js";

import RandomItemPicker
    from "../../utils/randomItemPicker.js";

import { extractSessionCookie }
    from "../../utils/SessionCookieExtractor.js";

import * as exploringService
    from "./exploring.service.js";

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