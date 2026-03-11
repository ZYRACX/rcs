import appwriteConfig from "../../config/appwrite.js";
import { Query } from "node-appwrite";

export async function getPlayerInventory(userId, tablesDB) {
    const inventoryResult = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
        queries: [
            Query.equal("userId", userId)
        ]
    });
    return inventoryResult;
}

export async function getItems(tablesDB) {
    const itemsResult = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.ITEM_TABLE,
    });
    return itemsResult;
}