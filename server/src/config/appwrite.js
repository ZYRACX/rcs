export default {
    appwrite: {
        ENDPOINT: process.env.APPWRITE_ENDPOINT,
        PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
        databaseId: process.env.APPWRITE_DATABASE_ID,
        USER_TABLE: "user",
        DEVICE_TABLE: "devices",
        INVENTORY_TABLE: "inventory",
        MARKET_TABLE: "market",
        ITEM_TABLE: "items",
        BUCKET_ITEMS_ID: process.env.APPWRITE_BUCKET_ITEMS_ID,
    }
}