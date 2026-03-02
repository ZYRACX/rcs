import { account, tablesDB, Query} from "../../utils/appwrite.js"
import appwriteConfig from "../../config/appwrite.js"
export async function register(username, email, password, trackerId) {

    if (trackerId)  {
        const existingTracker = await tablesDB.listRows({
            databaseId: appwriteConfig.appwrite.databaseName,
            tableId: appwriteConfig.appwrite.DEVICE_TABLE,
            queries: [
                Query.equal("trackerId", trackerId)
            ]
        })
        existingTracker.rows.forEach(async (tracker) => {
            console.log(tracker)
        })

    try {
        const user = await account.create({email, password, name: username});

        return {
            userId: user.$id, 
            username: user.name
        };

    } catch (error) {       
        if (error.code !== 404) {
            console.error("Error checking user existence:", error);
            throw new Error("Database error");
        }  
    } 
}}

export async function login(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    
    return {
      userId: user.$id,
      username: user.name
    };
  } catch (error) {
    throw error;
  }
}