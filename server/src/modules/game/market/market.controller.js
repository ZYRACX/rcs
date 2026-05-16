import {
    createAppwriteClient
} from "../../../utils/appwrite.js";

import {
    extractSessionCookie
} from "../../../utils/SessionCookieExtractor.js";

import * as marketService
from "./market.service.js";


/**
 * Get all market listings
 * 
 * @route GET /market/listings
 */
export async function getListings(
    req,
    res
) {

    try {

        const { tablesDB } =
            createAppwriteClient(
                "admin"
            );

        const listings =
            await marketService.getListings(
                tablesDB
            );

        return res.status(200).json({

            listings

        });

    } catch (error) {

        console.error(
            "Get listings error:",
            error
        );

        return res.status(500).json({

            error:
                "Failed to fetch listings"

        });

    }

}


/**
 * Create market listing
 * 
 * @route POST /market/list
 */
export async function createListing(
    req,
    res
) {

    try {

        const {
            itemId,
            quantity,
            price,
            sell_as_all_together
        } = req.body;

        const session =
            extractSessionCookie(req);

        const { account } =
            createAppwriteClient(
                "user",
                session
            );

        const { tablesDB } =
            createAppwriteClient(
                "admin"
            );

        const user =
            await account.get();

            console.log(req.body);
            
        const listing =
            await marketService.createListing(

                tablesDB,

                user.$id,

                itemId,

                quantity,

                price,

                sell_as_all_together

            );

        return res.status(200).json({

            message:
                "Listing created successfully",

            listing

        });

    } catch (error) {

        console.error(
            "Create listing error:",
            error
        );

        return res.status(500).json({

            error:
                error.message ||
                "Failed to create listing"

        });

    }

}


/**
 * Buy market listing
 * 
 * @route POST /market/buy/:listingId
 */
export async function buyListing(
    req,
    res
) {

    try {

        const {
            listingId
        } = req.params;

        const session =
            extractSessionCookie(req);

        const { account } =
            createAppwriteClient(
                "user",
                session
            );

        const { tablesDB } =
            createAppwriteClient(
                "admin"
            );

        const user =
            await account.get();

        const result =
            await marketService.buyListing(

                tablesDB,

                user.$id,

                listingId

            );

        return res.status(200).json({

            message:
                "Purchase successful",

            result

        });

    } catch (error) {

        console.error(
            "Buy listing error:",
            error
        );

        return res.status(500).json({

            error:
                error.message ||
                "Failed to buy listing"

        });

    }

}