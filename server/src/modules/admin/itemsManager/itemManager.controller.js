import { request, response } from "express";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import fs from "fs";
import { createAppwriteClient } from "../../../utils/appwrite.js";
import appwrite from "../../../config/appwrite.js";

/**
 * Helper function to generate static Appwrite Preview URLs
 */
function getAppwriteImageUrl(fileId) {
    if (!fileId) return "";
    return `${appwrite.appwrite.ENDPOINT}/storage/buckets/${appwrite.appwrite.BUCKET_ITEMS_ID}/files/${fileId}/preview?project=${appwrite.appwrite.PROJECT_ID}`;
}

/**
 * Fetch all items and attach their storage preview URLs
 */
export async function getAllItems(req, res) {
    try {
        const { tablesDB } = createAppwriteClient("admin");
        const items = await tablesDB.listRows({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE
        });

        const processedItems = items.rows.map(item => ({
            ...item,
            itemImageUrl: getAppwriteImageUrl(item.$id)
        }));

        return res.status(200).send({
            total_items: items.total,
            items: processedItems
        });
    } catch (error) {
        console.error("Error fetching items:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * Create a new item documentation row
 */
export async function addItem(req, res) {
    try {
        const { itemName, itemAltId, itemBaseValue, chanceOfGetting, wayToObtain } = req.body;
        const { tablesDB } = createAppwriteClient("admin");
        const { storage } = createAppwriteClient("admin");

        const parsedBaseValue = parseInt(itemBaseValue, 10) || 0;
        const parsedChance = parseFloat(chanceOfGetting) || 0;

        // Safe JSON parsing defense
        let parsedWays = [];
        if (wayToObtain) {
            parsedWays = typeof wayToObtain === "string" ? JSON.parse(wayToObtain) : wayToObtain;
        }

        const result = await tablesDB.createRow({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE,
            rowId: ID.unique(),
            data: {
                itemName,
                itemAltId,
                itemBaseValue: parsedBaseValue,
                chanceOfGetting: parsedChance,
                wayToObtain: parsedWays
            }
        });

        if (!result?.$id) {
            return res.status(500).json({ error: "Failed to create database row." });
        }

        if (req.file) {
            const appwriteFile = InputFile.fromPath(req.file.path, req.file.originalname);
            await storage.createFile({
                bucketId: appwrite.appwrite.BUCKET_ITEMS_ID,
                fileId: result.$id,
                file: appwriteFile
            });
            fs.unlinkSync(req.file.path);
        }

        return res.status(200).json({
            message: "Item has successfully added to the database.",
            item: { ...result, itemImageUrl: req.file ? getAppwriteImageUrl(result.$id) : "" }
        });

    } catch (error) {
        console.error("Error occurred while adding an item: ", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Update target item attributes and handle file replacements safely
 */
export async function updateItem(req, res) {
    try {
        const { itemId } = req.params;
        const { itemName, itemAltId, itemBaseValue, chanceOfGetting, wayToObtain } = req.body;

        console.log(`\n--- 🔄 Incoming Update Request For: ${itemId} ---`);
        console.log("Payload Body Data:", req.body);
        console.log("Payload File Attached:", req.file ? req.file.originalname : "No new file");

        const { tablesDB } = createAppwriteClient("admin");
        const { storage } = createAppwriteClient("admin");

        // 1. Guard against empty numbers changing to NaN
        const parsedBaseValue = itemBaseValue !== undefined ? (parseInt(itemBaseValue, 10) || 0) : 0;
        const parsedChance = chanceOfGetting !== undefined ? (parseFloat(chanceOfGetting) || 0) : 0.0;

        // 2. Resilient Array-vs-String verification parsing
        let parsedWays = [];
        if (wayToObtain) {
            try {
                parsedWays = typeof wayToObtain === "string" ? JSON.parse(wayToObtain) : wayToObtain;
            } catch (jsonErr) {
                console.error("Warning: Failed to parse wayToObtain field:", jsonErr.message);
                parsedWays = [];
            }
        }

        // 3. Perform Appwrite Database Mutation
        const result = await tablesDB.updateRow({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE,
            rowId: itemId,
            data: {
                itemName,
                itemAltId,
                itemBaseValue: parsedBaseValue,
                chanceOfGetting: parsedChance,
                wayToObtain: parsedWays
            }
        });

        console.log("✅ Database record updated successfully.");

        // 4. File Modification Lifecycle Engine
        if (req.file) {
            // Check if old file physically exists inside the bucket storage map
            const fileExists = await storage.getFile({
                bucketId: appwrite.appwrite.BUCKET_ITEMS_ID,
                fileId: itemId
            }).catch((err) => {
                console.log(`❌ Appwrite could NOT find any file matching ID "${itemId}". Reason: ${err.message}`);
                return null;
            });

            if (fileExists) {
                console.log("Wiping out deprecated original storage file asset...");
                await storage.deleteFile({
                    bucketId: appwrite.appwrite.BUCKET_ITEMS_ID,
                    fileId: itemId
                }).catch((err) => console.log("Storage bypass notice:", err.message));
            }

            // Read path routing for the new image asset
            const appwriteFile = InputFile.fromPath(req.file.path, req.file.originalname);

            await storage.createFile({
                bucketId: appwrite.appwrite.BUCKET_ITEMS_ID,
                fileId: itemId,
                file: appwriteFile
            });

            console.log("✅ New image uploaded successfully to Appwrite storage.");
            fs.unlinkSync(req.file.path); // Clear server temporary cache space
        }

        return res.status(200).json({
            message: "The item has successfully updated.",
            item: { ...result, itemImageUrl: getAppwriteImageUrl(itemId) }
        });

    } catch (error) {
        console.error("❌ Critical Failure inside updateItem service routine:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Remove target item records from the database
 */
export async function deleteItem(req, res) {
    try {
        const { itemId } = req.params;
        const { tablesDB } = createAppwriteClient("admin");

        await tablesDB.deleteRow({
            databaseId: appwrite.appwrite.databaseId,
            tableId: appwrite.appwrite.ITEM_TABLE,
            rowId: itemId
        });

        return res.status(200).json({
            message: "The item has successfully deleted from the database."
        });
    } catch (error) {
        console.error("Error during deletion of an item: ", error);
        return res.status(500).json({ error: error.message });
    }
}