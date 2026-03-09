import {request, response} from "express"
import { createAppwriteClient, Query } from "../../utils/appwrite.js"
import appwriteConfig from "../../config/appwrite.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export async function getBalance(req, res) {
    try{
        const rawSessionCookie = req.headers.cookie
        // console.log(rawSessionCookie.split("=")[1])
        const session = rawSessionCookie.split("=")[1]

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
        })
        
        const balance = result.rows[0].balance
        // console.log(balance)

        return res.status(200).json({balance})
        
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
}