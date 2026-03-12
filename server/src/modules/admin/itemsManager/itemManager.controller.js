import {request, response } from "express";
import {ID} from "node-appwrite"
import { createAppwriteClient } from "../../../utils/appwrite.js";
import appwrite from "../../../config/appwrite.js";
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function getAllItems(req, res){
    try{
        const { tablesDB } = createAppwriteClient("admin")
        const items = await tablesDB.listRows({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE
        })

        return res.status(200).send({
            total_items: items.total,
            items: items.rows
        })
    }catch(error){}
}