import appwrite from "../../../config/appwrite.js";
import { createAppwriteClient, Query } from "../../../utils/appwrite.js";
import { request, response } from "express";
import * as service from "./playerManage.service.js"
import {addOneItemToInventory, removeOneItemToInventory} from "../../../shared/services/inventory.service.js"
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function getUserDataByUserId(req, res) {
    try{
        const {userId} = req.params
        const {tablesDB} = createAppwriteClient("admin")

        const user = await tablesDB.listRows({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.USER_TABLE,
            queries: [Query.equal("userId", userId)]
        })

        return res.status(200).json({ 
            $id: user.rows[0].$id,
            username: user.rows[0].username,
            userId: user.rows[0].userId,
            balance: user.rows[0].balance,
            experience: user.rows[0].experience,
            isAdmin: user.rows[0].isAdmin,
            level: user.rows[0].level
        })

    }catch(error){
        console.log(error)
    }
}

/**
 * Get the inventory of a specific player (Admin only)
 *
 * This endpoint:
 * 1. Reads userId from route params
 * 2. Uses the admin Appwrite client
 * 3. Fetches the player's inventory rows
 * 4. Fetches item metadata
 * 5. Combines both datasets into a structured response
 *
 * Route:
 * GET /admin/player/:userId/inventory
 *
 * @param {request} req
 * @param {response} res
 */
export async function getPlayerInventoryAdmin(req, res) {
  try {

    /**
     * Extract player ID from URL
     */
    const { userId } = req.params;

    /**
     * Final formatted inventory response
     */
    const inventoryItems = [];

    /**
     * Admin Appwrite client
     */
    const { tablesDB } = createAppwriteClient("admin");

    /**
     * Fetch player inventory rows
     */
    const inventoryResult = await service.getPlayerInventoryForAdmin(
      userId,
      tablesDB
    );

    /**
     * Fetch item metadata
     */
    const itemsResult = await service.getItemsForAadmin(tablesDB);

    /**
     * Combine inventory rows with item metadata
     */
    for (let playerInventoryItem of inventoryResult.rows) {

      const item = itemsResult.rows.find(
        (item) => item.$id === playerInventoryItem.itemId
      );

      if (item) {
        inventoryItems.push({
          itemId: playerInventoryItem.itemId,
          name: item.itemName,
          quantity: playerInventoryItem.amount,
          itemBaseValue: item.itemBaseValue,
        });
      }
    }

    /**
     * Return formatted inventory
     */
    return res.status(200).json({
      inventory: inventoryItems,
    });

  } catch (error) {

    console.error("Admin inventory fetch error:", error);

    return res.status(500).json({
      error: "Failed to fetch player inventory",
    });

  }
}
/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export async function addPlayerItemToInventory(req, res) {
  try{
    const {userId} = req.params
    const {itemId, amount} = req.body

    const {tablesDB} = createAppwriteClient("admin")
    const updatedItem = await addOneItemToInventory(tablesDB, userId, itemId, amount)

    if(updatedItem.created) return res.status(201).json({
      message: "Item successfully added to the player inventory.",
      item_alt_id: updatedItem.created.itemAltId,
      item_$id: updatedItem.created.$id
    })
    else return res.status(200).json({
      message: "Item successfuly updated to the player inventory.",
      item_alt_id: updatedItem.updated.itemAltId,
      item_$id: updatedItem.updated.$id
    })
    
  } catch(error){
    console.log("Error from addPlayerItemToInventory(): " + error)
  }
}

export async function removePlayerItemToInventory(req, res) {
  try{
    const {userId} = req.params
    const {itemId, amount} = req.body

    const {tablesDB} = createAppwriteClient("admin")
    const updatedItem = await removeOneItemToInventory(tablesDB, userId, itemId, amount)

    return res.status(200).json({
      message: "Item successfuly updated to the player inventory.",
      item_alt_id: updatedItem.updated.itemAltId,
      item_$id: updatedItem.updated.$id
    })
    
  } catch(error){
    console.log("Error from removePlayerItemToInventory(): " + error)
  }
}