import { ID, Query } from "node-appwrite";

import appwriteConfig from "../../../config/appwrite.js";

/**
 * Cooldown period in milliseconds (10 seconds)
 * @constant {number}
 */
const COOLDOWN_MS = 10000;

/**
 * Checks if a user can perform an exploring action based on cooldown period
 * 
 * Retrieves the user's last explore timestamp from the database and calculates
 * whether enough time has passed since the last explore (10 seconds minimum).
 * 
 * @async
 * @param {Object} tablesDB - Appwrite TablesDB instance for database operations
 * @param {string} userId - The unique identifier of the user to check cooldown for
 * 
 * @returns {Promise<Object>} Cooldown status object containing:
 *   - {boolean} allowed - Whether the user can perform explore action
 *   - {number} remaining - Milliseconds remaining until cooldown expires (0 if allowed)
 * 
 * @throws {Error} If database query fails
 * 
 * @example
 * // User can explore
 * const result = await checkExploringCooldown(tablesDB, "user123");
 * // { allowed: true, remaining: 0 }
 * 
 * @example
 * // User is on cooldown
 * const result = await checkExploringCooldown(tablesDB, "user123");
 * // { allowed: false, remaining: 3500 }
 */
export async function checkExploringCooldown(
  tablesDB,
  userId
) {
  const result = await tablesDB.listRows({
    databaseId:
      appwriteConfig.appwrite.databaseId,

    tableId:
      appwriteConfig.appwrite.USER_TABLE,

    queries: [
      Query.equal("userId", userId),
    ],
  });

  if (result.rows.length === 0) {
    return {
      allowed: true,
      remaining: 0,
    };
  }

  const lastExplore =
    result.rows[0].lastExploreAt;

  if (!lastExplore) {
    return {
      allowed: true,
      remaining: 0,
    };
  }

  const lastExploreTime = new Date(
    lastExplore
  ).getTime();

  const now = Date.now();

  if (
    now - lastExploreTime <
    COOLDOWN_MS
  ) {
    const remaining =
      COOLDOWN_MS -
      (now - lastExploreTime);

    return {
      allowed: false,
      remaining,
    };
  }

  return {
    allowed: true,
    remaining: 0,
  };
}

/**
 * Updates the user's last explore timestamp to the current time
 * 
 * Records when the user performed their last explore action. This timestamp is used
 * to enforce the cooldown period for subsequent explore actions.
 * 
 * @async
 * @param {Object} tablesDB - Appwrite TablesDB instance for database operations
 * @param {string} userId - The unique identifier of the user whose timestamp should be updated
 * 
 * @returns {Promise<void>}
 * 
 * @throws {Error} If database update fails
 * 
 * @note If the user record is not found in the database, this function returns early without error
 * 
 * @example
 * await updateExploringTimestamp(tablesDB, "user123");
 * // User's lastExploreAt field is now set to current timestamp
 */
export async function updateExploringTimestamp(
  tablesDB,
  userId
) {
  const result = await tablesDB.listRows({
    databaseId:
      appwriteConfig.appwrite.databaseId,

    tableId:
      appwriteConfig.appwrite.USER_TABLE,

    queries: [
      Query.equal("userId", userId),
    ],
  });

  if (result.rows.length === 0) return;

  const row = result.rows[0];

  await tablesDB.updateRow({
    databaseId:
      appwriteConfig.appwrite.databaseId,

    tableId:
      appwriteConfig.appwrite.USER_TABLE,

    rowId: row.$id,

    data: {
      lastExploreAt:
        new Date().toISOString(),
    },
  });
}

/**
 * Retrieves all items that can be obtained through exploring
 * 
 * Queries the database for all items marked with "explorable" in their wayToObtain field.
 * These items are the pool from which random items are selected during explore actions.
 * 
 * @async
 * @param {Object} tablesDB - Appwrite TablesDB instance for database operations
 * 
 * @returns {Promise<Array<Object>>} Array of item objects that can be found while exploring.
 *   Each item contains properties like:
 *   - {string} $id - Unique item identifier
 *   - {string} itemName - Display name of the item
 *   - {number} chanceOfGetting - Rarity weight for random selection
 *   - {Array<string>} wayToObtain - Array containing "explorable" flag
 * 
 * @throws {Error} If database query fails
 * 
 * @example
 * const items = await getExploreableItems(tablesDB);
 * // [
 * //   { $id: "item1", itemName: "Bronze Ore", chanceOfGetting: 50, wayToObtain: ["explorable"] },
 * //   { $id: "item2", itemName: "Silver Ore", chanceOfGetting: 30, wayToObtain: ["explorable"] }
 * // ]
 */
export async function getExploreableItems(
  tablesDB
) {
  const result = await tablesDB.listRows({
    databaseId:
      appwriteConfig.appwrite.databaseId,

    tableId:
      appwriteConfig.appwrite.ITEM_TABLE,

    queries: [
      Query.contains(
        "wayToObtain",
        "explorable"
      ),
    ],
  });

  return result.rows;
}

/**
 * Groups and counts items by ID
 * 
 * Aggregates an array of item IDs into an object where keys are item IDs and values are counts.
 * This is used to convert the array of randomly selected items into a summary format for
 * inventory operations.
 * 
 * @async
 * @param {Array<string>} items - Array of item IDs (may contain duplicates)
 * 
 * @returns {Promise<Object<string, number>>} Object with item IDs as keys and quantities as values
 * 
 * @example
 * const items = ["item1", "item2", "item1", "item3", "item1"];
 * const sorted = await getSortedItems(items);
 * // { item1: 3, item2: 1, item3: 1 }
 * 
 * @example
 * // Handles empty arrays gracefully
 * const sorted = await getSortedItems([]);
 * // {}
 */
export async function getSortedItems(
  items
) {
  const counts = {};

  for (const item of items) {
    const id = item;

    if (!id) continue;

    if (!counts[id]) {
      counts[id] = 0;
    }

    counts[id]++;
  }

  return counts;
}

/**
 * Adds grouped items to a user's inventory
 * 
 * Processes grouped items and adds them to the user's inventory. For each item:
 * - If the item already exists in the user's inventory, increments the quantity
 * - If the item is new to the user's inventory, creates a new inventory record
 * 
 * This function handles batch inventory updates for items obtained from exploring.
 * 
 * @async
 * @param {Object} tablesDB - Appwrite TablesDB instance for database operations
 * @param {Object<string, number>} sortedItems - Object mapping item IDs to quantities
 *   Example: { "item1": 5, "item2": 3 }
 * @param {string} userId - The unique identifier of the user whose inventory should be updated
 * 
 * @returns {Promise<Object>} Summary of inventory updates containing:
 *   - {number} updatedItems - Total number of inventory records created or updated
 * 
 * @throws {Error} If any database operation fails
 * 
 * @example
 * const sortedItems = { "ore": 2, "coal": 1 };
 * const result = await addToInventory(tablesDB, sortedItems, "user123");
 * // { updatedItems: 2 }
 * 
 * @example
 * // User already has some items
 * // ore: 5 (existing) + 2 (new) = 7
 * // coal: 0 (new) = 1
 * const result = await addToInventory(tablesDB, sortedItems, "user123");
 * // { updatedItems: 2 }
 */
export async function addToInventory(
  tablesDB,
  sortedItems,
  userId
) {
  const results = [];

  for (const [itemId, quantity] of Object.entries(
    sortedItems
  )) {
    const existing =
      await tablesDB.listRows({
        databaseId:
          appwriteConfig.appwrite.databaseId,

        tableId:
          appwriteConfig.appwrite
            .INVENTORY_TABLE,

        queries: [
          Query.equal(
            "userId",
            userId
          ),

          Query.equal(
            "itemId",
            itemId
          ),
        ],
      });

    if (existing.rows.length > 0) {
      const row = existing.rows[0];

      const updated =
        await tablesDB.updateRow({
          databaseId:
            appwriteConfig.appwrite
              .databaseId,

          tableId:
            appwriteConfig.appwrite
              .INVENTORY_TABLE,

          rowId: row.$id,

          data: {
            amount:
              row.amount + quantity,
          },
        });

      results.push(updated);
    } else {
      const created =
        await tablesDB.createRow({
          databaseId:
            appwriteConfig.appwrite
              .databaseId,

          tableId:
            appwriteConfig.appwrite
              .INVENTORY_TABLE,

          rowId: ID.unique(),

          data: {
            userId,
            itemId,
            amount: quantity,
          },
        });

      results.push(created);
    }
  }

  return {
    updatedItems: results.length,
  };
}