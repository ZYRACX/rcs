// src/modules/auth/auth.controller.js

import * as authService from "./auth.service.js";

export async function discordAuth(req, res) {

  const { userId, username } = req.query;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required"
    });
  }

  try {

    const user = await authService.discordAuth(userId, username);

    return res.status(200).json({
      message: "User authenticated successfully",
      userId: user.userId
    });

  } catch (error) {

    console.error("Discord auth error:", error);

    return res.status(500).json({
      error: "Database error"
    });

  }

}

export async function WebLoginController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required"
    });
  }
  try {
    const user = await authService.login(email, password);
    return res.status(200).json({
      message: "User logged in successfully",
      userId: user.userId
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(404).json({
        error: "User not found"
      });
    }
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Database error"
    });
  }
}

export async function WebRegisterController(req, res) {

  const { username, email, password } = req.body;
  const { trackerId } = req;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: "Username, email, and password are required"
    });
  }

  try {
    const user = await authService.register(
      username,
      email,
      password,
      trackerId
    );



    return res.status(201).json({
      message: "User registered successfully",
      userId: user.userId
    });

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(409).json({
        error: "User already exists"
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      error: "Database error"
    });

  }

}