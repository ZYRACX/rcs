import {request, response} from "express"
import { createAppwriteClient, Query } from "../../utils/appwrite.js"
import appwriteConfig from "../../config/appwrite.js"
import {extractSessionCookie} from "../../utils/SessionCookieExtractor.js"

import * as miningService from "./mine.service.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export async function getMiniedItems(req, res) {
    try{

        const session = extractSessionCookie(req)

        const {account} = createAppwriteClient("user", session);
        const {tablesDB} = createAppwriteClient("admin");

        const result = await tablesDB.updateRow({
            databaseId: appwriteConfig.appwrite.databaseId,
            tableId: appwriteConfig.appwrite.ITEM_TABLE,
            rowId: "6999db13003a92979158",
            data: {
                wayToObtain: ["mineable", "explorable"]
            }
        })
        console.log(result)
        
        const user = await account.get();

        const minedItems = await miningService.getMinableItems(tablesDB)
    }
    catch(error){
    }
}