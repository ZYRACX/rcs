import { createAppwriteClient, ID } from "../../utils/appwrite.js"
// import appwriteConfig from "../../config/appwrite.js"
export async function register(username, email, password) {

  try {
    const { account } = createAppwriteClient("admin")

    const user = await account.create({ userId: ID.unique(), email: email, password: password, name: username });
    return {
      userId: user.$id,
      username: user.name
    };



  } catch (error) {
    console.error("Auth register error:", error);
    if (error.code == 400 && error.type == 'general_argument_invalid') {
      return {
        code: error.code,
        error: "Password must be between 8 and 265 characters long, and should not be one of the commonly used password."
      }
    }

    if (error.code == 409 && error.type == 'user_already_exists') {
      return {
        code: error.code,
        error: "User already exists"
      }
    }


  }
}