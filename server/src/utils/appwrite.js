import {Databases, Account, ID, TablesDB, Client, Query} from "node-appwrite"
import dotenv from 'dotenv';
dotenv.config()

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const account = new Account(client);
const tablesDB = new TablesDB(client);

export { databases, account, tablesDB, ID, Query};