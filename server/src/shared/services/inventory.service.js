import { Query, TablesDB, ID } from "node-appwrite";
import appwriteConfig from "../../config/appwrite.js"


/**
 * 
 * @param {TablesDB} tablesDB 
 * @param {string} userId 
 * @param {string} itemId 
 * @returns 
*/
export async function addOneItemToInventory(tablesDB, userId, itemId, quantity) {

    try {

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

                const updated = await tablesDB.updateRow({
                    databaseId: appwriteConfig.appwrite.databaseId,
                    tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                    rowId: row.$id,
                    data: {
                        amount: row.amount + quantity
                    }
                });

                return {
                    updated
                }
            } else {

                const created = await tablesDB.createRow({
                    databaseId: appwriteConfig.appwrite.databaseId,
                    tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                    rowId: ID.unique(),
                    data: {
                        userId,
                        itemId,
                        amount: quantity
                    }
                });

                return {
                    created
                }
            }

    } catch (error) {

        console.error("Error updating inventory:", error);
        throw error;
    }
}




/**
 * 
 * @param {TablesDB} tablesDB 
 * @param {string} userId 
 * @param {string} itemId 
 * @returns 
*/
export async function removeOneItemToInventory(tablesDB, userId, itemId, quantity) {

    try {

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

                const updated = await tablesDB.updateRow({
                    databaseId: appwriteConfig.appwrite.databaseId,
                    tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
                    rowId: row.$id,
                    data: {
                        amount: row.amount - quantity
                    }
                });

                return {
                    updated
                }
            } else return

    } catch (error) {

        console.error("Error updating inventory:", error);
        throw error;
    }
}