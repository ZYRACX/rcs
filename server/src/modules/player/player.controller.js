import {request, response} from "express"
import { createAppwriteClient, Query } from "../../utils/appwrite.js"
import appwriteConfig from "../../config/appwrite.js"
import {extractSessionCookie} from "../../utils/SessionCookieExtractor.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export async function getPlayerStats(req, res) {
    try{

        const session = extractSessionCookie(req)
        console.log("Session Cookie:", session);
        const {account} = createAppwriteClient("user", session);
        const {tablesDB} = createAppwriteClient("admin");

        const user = await account.get();

        const result = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.USER_TABLE,
            queries: [
                Query.equal("userId", user.$id),
                // Query.limit(1)
            ]
        }).catch((error) => {
            console.error("Error fetching player stats:", error);
            throw new Error("Failed to fetch player stats");
        });
        
        const balance = result.rows[0].balance;
        const level = result.rows[0].level;
        const experience = result.rows[0].experience;

        return res.status(200).json({balance, level, experience})
        
    }
    catch(error){
        console.error("Error fetching player stats:", error);
        return res.status(500).json({error: "Failed to fetch player stats"})
    }
}