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

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function addItem(req, res){
    try{

        const {itemName, itemAltId, itemBaseValue, chanceOfGetting, wayToObtain} = req.body

        const {tablesDB} = createAppwriteClient("admin")

        const result = await tablesDB.createRow({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE,
            rowId: ID.unique(),
            data: {
                itemName,
                itemAltId,
                itemBaseValue,
                chanceOfGetting,
                wayToObtain
            }
        })
        if(!result.$id) return res.status("500").message

        return res.status(200).json({
            message: "Item has successfully added to the database.",
            newItemId: result.$id
        })

    }catch(error){
        console.log(error)
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function updateItem(req, res) {
    try{
        const {itemId} = req.params
        const {itemName, itemAltId, itemBaseValue, chanceOfGetting, wayToObtain} = req.body
        // console.log(itemName, wayToObtain)

        const {tablesDB} = createAppwriteClient("admin")
        const result = await tablesDB.updateRow({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE,
            rowId: itemId,
            data: {
                itemName,
                itemAltId,
                itemBaseValue,
                chanceOfGetting,
                wayToObtain
            }
        }).catch((error) => {
            console.log("Error when trying to update a item", error)
        })

        
    }catch(error){}
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function deleteItem(req, res) {
    try{
    const {itemId} = req.params

    const {tablesDB} = createAppwriteClient("admin")

    const result = await tablesDB.deleteRow({
        databaseId: appwrite.appwrite.databaseId,
        tableId: appwrite.appwrite.ITEM_TABLE,
        rowId: itemId
    })

    return res.status(200).json({
        message: "The item has successfully deleted from the database."
    })

    }catch(error) {
        console.log("Error during deletion of an item: " + error)
    }
    

}