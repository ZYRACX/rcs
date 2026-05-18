export default {
  appwrite: {
    ENDPOINT: process.env.SUPABASE_URL,
    PROJECT_ID: process.env.SUPABASE_PROJECT_ID || "supabase",
    databaseId: process.env.SUPABASE_DB_SCHEMA || "public",
    USER_TABLE: "user",
    DEVICE_TABLE: "devices",
    INVENTORY_TABLE: "inventory",
    MARKET_TABLE: "market",
    ITEM_TABLE: "items",
    BUCKET_ITEMS_ID: process.env.SUPABASE_BUCKET_ITEMS_ID || "items",
  }
}
