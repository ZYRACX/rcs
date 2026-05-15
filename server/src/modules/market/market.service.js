import { ID, Query } from "node-appwrite";

import appwriteConfig from "../../config/appwrite.js";

import * as sharedInventoryService from "../../shared/services/inventory.service.js";

/**
 * Create market listing
 */
export async function createListing(
    tablesDB,
    sellerId,
    itemId,
    quantity,
    pricePerUnit
) {
    const inventory = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
        queries: [
            Query.equal("userId", sellerId),
            Query.equal("itemId", itemId)
        ]
    });

    if (inventory.rows.length === 0) {
        throw new Error("Item not found in inventory");
    }

    const row = inventory.rows[0];

    if (row.amount < quantity) {
        throw new Error("Not enough quantity");
    }

    /**
     * Remove item from inventory
     */
    await tablesDB.updateRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.INVENTORY_TABLE,
        rowId: row.$id,
        data: {
            amount: row.amount - quantity
        }
    });

    /**
     * Create market listing
     */
    const listing = await tablesDB.createRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.MARKET_TABLE,
        rowId: ID.unique(),
        data: {
            sellerId,
            itemId,
            quantity,
            pricePerUnit,
            totalPrice: quantity * pricePerUnit,
            isSold: false,
            createdAt: new Date().toISOString()
        }
    });

    return listing;
}

/**
 * Get active market listings
 */
export async function getListings(tablesDB) {
    const listings = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.MARKET_TABLE,
        queries: [
            Query.equal("isSold", false)
        ]
    });

    return listings.rows;
}

/**
 * Buy market listing
 */
export async function buyListing(
    tablesDB,
    buyerId,
    listingId
) {
    /**
     * Get listing
     */
    const listing = await tablesDB.getRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.MARKET_TABLE,
        rowId: listingId
    });

    if (listing.isSold) {
        throw new Error("Listing already sold");
    }

    if (listing.sellerId === buyerId) {
        throw new Error("Cannot buy your own listing");
    }

    /**
     * Get buyer data
     */
    const buyerResult = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.USER_TABLE,
        queries: [
            Query.equal("userId", buyerId)
        ]
    });

    /**
     * Get seller data
     */
    const sellerResult = await tablesDB.listRows({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.USER_TABLE,
        queries: [
            Query.equal("userId", listing.sellerId)
        ]
    });

    if (buyerResult.rows.length === 0) {
        throw new Error("Buyer not found");
    }

    if (sellerResult.rows.length === 0) {
        throw new Error("Seller not found");
    }

    const buyer = buyerResult.rows[0];
    const seller = sellerResult.rows[0];

    /**
     * Check balance
     */
    if (buyer.balance < listing.totalPrice) {
        throw new Error("Not enough balance");
    }

    /**
     * Remove coins from buyer
     */
    await tablesDB.updateRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.USER_TABLE,
        rowId: buyer.$id,
        data: {
            balance: buyer.balance - listing.totalPrice
        }
    });

    /**
     * Add coins to seller
     */
    await tablesDB.updateRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.USER_TABLE,
        rowId: seller.$id,
        data: {
            balance: seller.balance + listing.totalPrice
        }
    });

    /**
     * Give item to buyer
     */
    await sharedInventoryService.addItem(
        tablesDB,
        buyerId,
        listing.itemId,
        listing.quantity
    );

    /**
     * Mark listing sold
     */
    await tablesDB.updateRow({
        databaseId: appwriteConfig.appwrite.databaseId,
        tableId: appwriteConfig.appwrite.MARKET_TABLE,
        rowId: listing.$id,
        data: {
            isSold: true
        }
    });

    return {
        success: true,
        boughtItem: listing.itemId,
        quantity: listing.quantity,
        totalPaid: listing.totalPrice
    };
}