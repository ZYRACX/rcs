import {Account, ID, TablesDB, Client, Query} from "node-appwrite"
import dotenv from 'dotenv';
dotenv.config()



const {APPWRITE_PROJECT_ID, APPWRITE_PROJECT_NAME, APPWRITE_ENDPOINT, APPWRITE_KEY} = process.env;

/**
 * 
 * @param {"admin" | "user"} type 
 * @param {String} session 
 * @returns Account, TablesDB
 */

export function createAppwriteClient(type, session) {
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)

    if(type === "admin") {
      client.setKey(APPWRITE_KEY);
    }

    if(type === "user" && session) {
      client.setSession(session);
    }

    return {
      get account() {
        return new Account(client);
      },
      get tablesDB() {
        return new TablesDB(client);
      }
    }
}

export {ID, Query};