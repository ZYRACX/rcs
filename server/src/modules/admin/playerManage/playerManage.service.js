import { Query, TablesDB } from "node-appwrite";
import appwriteConfig from "../../../config/appwrite.js"

/**
 * 
 * @param {string} userId 
 * @param {TablesDB} tablesDB 
 * @returns 
 */
export async function getPlayerInventoryForAdmin(userId, tablesDB) {
    try{
        const inventoryResult = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
            queries: [
                Query.equal("userId", userId)
            ]
        });
        
        return inventoryResult;
    }catch(error) {
        console.log(error)
    }
}


export async function getItemsForAadmin(tablesDB) {
    const itemsResult = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.ITEM_TABLE,
    });
    return itemsResult;
}