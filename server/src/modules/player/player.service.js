import { TablesDB } from "node-appwrite";
import appwriteConfig from "../../config/appwrite.js"
import { Query } from "../../utils/appwrite.js"

/**
 * 
 * @param {string} userId 
 * @param {TablesDB} tablesDB 
 * @returns {Object<{balance: number, level: number, experience: number}>} Object containing player info such as balance, level, experience
 */
export async function getPlayerInfo(userId, tablesDB) {
            
        const result = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.USER_TABLE,
            queries: [
                Query.equal("userId", userId),
                Query.limit(1)
            ]
        }).catch((error) => {
            console.error("Error fetching player stats:", error);
            throw new Error("Failed to fetch player stats");
        });

        return result.rows[0];
}