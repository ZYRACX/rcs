import { TablesDB } from "node-appwrite"
import appwriteConfig from "../../config/appwrite.js"
import RandomItemPicker from "../../utils/randomItemPicker.js"


/**
 * 
 * @param {TablesDB} tablesDB 
 */
export async function getMinableItems(tablesDB){
    const itemList = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.ITEM_TABLE,
    })
}