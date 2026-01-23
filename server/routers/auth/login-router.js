const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../../prisma"); // adjust path if needed

const router = express.Router();

/**
 * GET userId by Discord ID
 * GET /discord/:discordId
 */
router.get("/discord/:discordId", async (req, res) => {
  const discordId = req.params.discordId;
  console.log("Fetching DiscordId:", discordId);

  if (!discordId) {
    return res.status(400).json({ error: "Discord ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { discord_uid: discordId },
      select: { userId: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ userId: user.userId });
  } catch (error) {
    console.error("Database error while fetching user:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

/**
 * Email / password login
 * POST /
 */
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: user.userId
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
