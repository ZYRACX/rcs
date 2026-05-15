import { ID, Query } from "node-appwrite";

import appwriteConfig from "../../../config/appwrite.js";

const COOLDOWN_MS = 10000;

/**
 * Check exploring cooldown
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
 * Update exploring timestamp
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
 * Get exploreable items
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
 * Group items
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
 * Add items to inventory
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