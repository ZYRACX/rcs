import * as marketService from "./market.service.js"
/**
 * Create a new marketplace listing.
 *
 * This controller:
 * - Extracts listing data from the request body
 * - Authenticates the user using the session cookie
 * - Creates a market listing through the market service
 * - Returns the created listing as JSON
 *
 * @async
 * @function createListing
 *
 * @param {import("express").Request} req
 * Express request object.
 *
 * @param {import("express").Response} res
 * Express response object.
 *
 * @returns {Promise<import("express").Response>}
 * JSON response containing the created listing
 * or an error message.
 *
 * @throws {Error}
 * Throws an error if:
 * - Authentication fails
 * - Item data is invalid
 * - Inventory validation fails
 * - Listing creation fails
 */
export async function createListing(req, res) {
    try {
        const {itemId, quantity, pricePerUnit} = req.body;

        const session = extractSessionCookie(req);

        const { account } = createAppwriteClient(
            "user",
            session
        );

        const { tablesDB } =
            createAppwriteClient("admin");

        const user = await account.get();

        const listing =
            await marketService.createListing(
                tablesDB,
                user.$id,
                itemId,
                quantity,
                pricePerUnit
            );

        return res.status(200).json({
            success: true,
            message: "Item listed successfully",
            listing
        });

    } catch (error) {
        console.error(
            "[CREATE_LISTING_ERROR]",
            error
        );

        return res.status(500).json({
            success: false,
            error:
                error.message ||
                "Failed to create listing"
        });
    }
}



export async function getListings(req, res){
    
}