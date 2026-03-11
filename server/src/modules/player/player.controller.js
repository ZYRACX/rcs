import {request, response} from "express"
import { createAppwriteClient } from "../../utils/appwrite.js"

import {extractSessionCookie} from "../../utils/SessionCookieExtractor.js"
import * as playerService from "./player.service.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns 
 */
export async function getPlayerStats(req, res) {
    try{

        const session = extractSessionCookie(req)
        const {account} = createAppwriteClient("user", session);
        const {tablesDB} = createAppwriteClient("admin");
        const userId = (await account.get()).$id
        
        const playerinfo = await playerService.getPlayerInfo(userId, tablesDB);
        
        const balance = playerinfo.balance;
        const level = playerinfo.level;
        const experience = playerinfo.experience;

        return res.status(200).json({balance, level, experience})
        
    }
    catch(error){
        console.error("Error fetching player stats:", error);
        return res.status(500).json({error: "Failed to fetch player stats"})
    }
}