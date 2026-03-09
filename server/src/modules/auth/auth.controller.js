// src/modules/auth/auth.controller.js

import * as authService from "./auth.service.js";
import appwriteConfig from "../../config/appwrite.js"
import { ID, createAppwriteClient } from "../../utils/appwrite.js";
// export async function discordAuth(req, res) {
  // const { userId, username } = req.query;

  // if (!userId) {
  //   return res.status(400).json({
  //     error: "User ID is required"
  //   });
  // }

  // try {

  //   const user = await authService.discordAuth(userId, username);

  //   return res.status(200).json({
  //     message: "User authenticated successfully",
  //     userId: user.userId
  //   });

  // } catch (error) {

  //   console.error("Discord auth error:", error);
  //   if(error.code === 400) {
  //     return res.status(422).json({
  //       error_message: "Password must be between 8 and 265 characters long, and should not be one of the commonly used password."
  //     })
  //   }

  //   if(error.code === 400 )

  //   return res.status(500).json({
  //     error_message: "Something went wrong during authentication"
  //   });

  // }

// }



export async function WebRegisterController(req, res) {

  const { username, email, password } = req.body;
  const { tablesDB } = createAppwriteClient("admin");
  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Username, email, and password are required"
    });
  }

  try { 
    const user = await authService.register(
      username,
      email,
      password
    );
    console.log("Registered user:", user);
    tablesDB.createRow({
      databaseId: appwriteConfig.appwrite.databaseId,
      tableId: appwriteConfig.appwrite.USER_TABLE,
      rowId: ID.unique(),
      data: {
        userId: user.userId,
        username: user.username,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      }
    })



    return res.status(201).json({
      message: "User registered successfully",
      userId: user.userId
    });

  } catch (error) {
    console.error("Registration error:", error);

    if(error.code === 400 && error.type === 'general_argument_invalid') {
      return res.status(422).json({
        error_message: "Password must be between 8 and 265 characters long, and should not be one of the commonly used password."
      })
    }

    if(error.code === 400 && error.type === 'row_missing_data') {
      return res.status(400).json({
        error_message: "User registration failed due to missing data. Please ensure all required fields are filled."
      })
    }

      if(error.code === 409 && error.type === 'user_already_exists') {
        return res.status(409).json({
          error_message: "User already exists"
        })
      }
    return res.status(500).json({
      error_message: "something went wrong during registration"
    });

  }

}