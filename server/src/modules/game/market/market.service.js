import {
    ID,
    Query
} from "node-appwrite";

import appwriteConfig
from "../../../config/appwrite.js";

import * as sharedInventoryService
from "../../../shared/services/inventory.service.js";


/**
 * Get all active market listings
 * 
 * @param {object} tablesDB
 * 
 * @returns {Promise<Array>}
 */
export async function getListings(
    tablesDB
) {

    const listings =
        await tablesDB.listRows({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.MARKET_TABLE,

            queries: [

                Query.equal(
                    "isSold",
                    false
                )

            ]

        });

    return listings.rows;

}


/**
 * Create market listing
 * 
 * @param {object} tablesDB
 * @param {string} sellerId
 * @param {string} itemId
 * @param {number} quantity
 * @param {number} price
 * @param {boolean} sell_as_all_together
 * 
 * @returns {Promise<object>}
 */
export async function createListing(

    tablesDB,

    sellerId,

    itemId,

    quantity,

    price,

    sell_as_all_together

) {

    /**
     * Get inventory row
     */

    const inventory =
        await tablesDB.listRows({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.INVENTORY_TABLE,

            queries: [

                Query.equal(
                    "userId",
                    sellerId
                ),

                Query.equal(
                    "itemId",
                    itemId
                )

            ]

        });

    if (
        inventory.rows.length === 0
    ) {

        throw new Error(
            "Item not found in inventory"
        );

    }

    const row =
        inventory.rows[0];

    /**
     * Validate quantity
     */

    if (
        row.amount < quantity
    ) {

        throw new Error(
            "Not enough quantity"
        );

    }

    /**
     * Remove item from inventory
     */

    await tablesDB.updateRow({

        databaseId:
            appwriteConfig.appwrite.databaseId,

        tableId:
            appwriteConfig.appwrite.INVENTORY_TABLE,

        rowId:
            row.$id,

        data: {

            amount:
                row.amount -
                quantity

        }

    });

    /**
     * Create listing
     */

    const listing =
        await tablesDB.createRow({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.MARKET_TABLE,

            rowId:
                ID.unique(),

            data: {

                sellerId,

                itemId,

                quantity,

                price,

                sell_as_all_together,

                isSold: false

            }

        });

    return listing;

}


/**
 * Buy market listing
 * 
 * @param {object} tablesDB
 * @param {string} buyerId
 * @param {string} listingId
 * 
 * @returns {Promise<object>}
 */
export async function buyListing(

    tablesDB,

    buyerId,

    listingId

) {

    /**
     * Get listing
     */

    const listing =
        await tablesDB.getRow({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.MARKET_TABLE,

            rowId:
                listingId

        });

    /**
     * Validate listing
     */

    if (listing.isSold) {

        throw new Error(
            "Listing already sold"
        );

    }

    if (
        listing.sellerId === buyerId
    ) {

        throw new Error(
            "Cannot buy your own listing"
        );

    }

    /**
     * Calculate final price
     */

    const finalPrice =
        listing.sell_as_all_together

            ? listing.price

            : listing.price *
              listing.quantity;

    /**
     * Get buyer
     */

    const buyerResult =
        await tablesDB.listRows({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.USER_TABLE,

            queries: [

                Query.equal(
                    "userId",
                    buyerId
                )

            ]

        });

    /**
     * Get seller
     */

    const sellerResult =
        await tablesDB.listRows({

            databaseId:
                appwriteConfig.appwrite.databaseId,

            tableId:
                appwriteConfig.appwrite.USER_TABLE,

            queries: [

                Query.equal(
                    "userId",
                    listing.sellerId
                )

            ]

        });

    if (
        buyerResult.rows.length === 0
    ) {

        throw new Error(
            "Buyer not found"
        );

    }

    if (
        sellerResult.rows.length === 0
    ) {

        throw new Error(
            "Seller not found"
        );

    }

    const buyer =
        buyerResult.rows[0];

    const seller =
        sellerResult.rows[0];

    /**
     * Validate balance
     */

    if (
        buyer.balance <
        finalPrice
    ) {

        throw new Error(
            "Not enough balance"
        );

    }

    /**
     * Remove buyer balance
     */

    await tablesDB.updateRow({

        databaseId:
            appwriteConfig.appwrite.databaseId,

        tableId:
            appwriteConfig.appwrite.USER_TABLE,

        rowId:
            buyer.$id,

        data: {

            balance:
                buyer.balance -
                finalPrice

        }

    });

    /**
     * Add seller balance
     */

    await tablesDB.updateRow({

        databaseId:
            appwriteConfig.appwrite.databaseId,

        tableId:
            appwriteConfig.appwrite.USER_TABLE,

        rowId:
            seller.$id,

        data: {

            balance:
                seller.balance +
                finalPrice

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

        databaseId:
            appwriteConfig.appwrite.databaseId,

        tableId:
            appwriteConfig.appwrite.MARKET_TABLE,

        rowId:
            listing.$id,

        data: {

            isSold: true

        }

    });

    return {

        success: true,

        itemId:
            listing.itemId,

        quantity:
            listing.quantity,

        totalPrice:
            finalPrice

    };

}