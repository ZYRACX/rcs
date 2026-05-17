export default {
    appwrite: {
        databaseId: process.env.APPWRITE_DATABASE_ID,
        USER_TABLE: "user",
        DEVICE_TABLE: "devices",
        INVENTORY_TABLE: "inventory",
        MARKET_TABLE: "market",
        ITEM_TABLE: "items",
        BUCKET_ITEMS_ID: process.env.APPWRITE_BUCKET_ITEMS_ID,
    }
}