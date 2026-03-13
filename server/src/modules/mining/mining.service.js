import { ID, Query } from "node-appwrite";
import appwriteConfig from "../../config/appwrite.js";

/**
 * Get mineable items
 */
export async function getMinableItems(tablesDB) {

    try {

        const result = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.ITEM_TABLE,
            queries: [
                Query.contains("wayToObtain", "mineable")
            ]
        });

        return result.rows;

    } catch (error) {
        console.error("Error fetching mineable items:", error);
        throw error;
    }
}


/**
 * Group mined items by ID
 * 
 * @param {Array<string>} items
 */
export async function getSortedItems(items) {

    const counts = {};
    for (const item of items) {
        const id = item;
        if (!id) continue;
        if (!counts[id]) {
            counts[id] = 0;
        }
        counts[id]++;
    }
    return counts;
}


/**
 * Upsert mined items into inventory
 * 
 * @param {TablesDB} tablesDB
 * @param {Object} sortedItems
 * @param {string} userId
 */
export async function addToInventory(tablesDB, sortedItems, userId) {

    try {

        const results = [];

        for (const [itemId, quantity] of Object.entries(sortedItems)) {

            // 1️⃣ Check if item already exists in inventory
            const existing = await tablesDB.listRows({
                databaseId: appwriteConfig.appwrite.databaseId,
                tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                queries: [
                    Query.equal("userId", userId),
                    Query.equal("itemId", itemId)
                ]
            });

            if (existing.rows.length > 0) {

                const row = existing.rows[0];

                // 2️⃣ Update existing row
                const updated = await tablesDB.updateRow({
                    databaseId: appwriteConfig.appwrite.databaseId,
                    tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                    rowId: row.$id,
                    data: {
                        amount: row.amount + quantity
                    }
                });

                results.push(updated);

            } else {

                // 3️⃣ Create new row
                const created = await tablesDB.createRow({
                    databaseId: appwriteConfig.appwrite.databaseId,
                    tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                    rowId: ID.unique(),
                    data: {
                        userId: userId,
                        itemId: itemId,
                        amount: quantity
                    }
                });

                results.push(created);
            }
        }

        return {
            updatedItems: results.length
        };

    } catch (error) {

        console.error("Error updating inventory:", error);
        throw error;
    }
}