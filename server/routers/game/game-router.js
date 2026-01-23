const express = require("express");
const router = express.Router();
const {prisma} = require("../../connection");
const { mineItems, items } = require("../../core/acitivity/mining/MiningItemPicker");

// Health check
router.get("/", (req, res) => {
  res.send("Game API is working!");
});

/**
 * GET inventory via Discord ID
 * /discord-inventory?discordId=xxx
 */
router.get("/discord-inventory", async (req, res) => {
  const { discordId } = req.query;
  console.log("Fetching inventory for DiscordId:", discordId);

  if (!discordId) {
    return res.status(400).json({ error: "Discord ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { discord_uid: discordId },
      include: {
        inventory: {
          include: {
            item: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const inventory = user.inventory.map(inv => ({
      itemId: inv.itemId,
      itemName: inv.item.itemName,
      itemValue: inv.item.itemValue,
      quantity: inv.quantity
    }));

    return res.status(200).json({ inventory });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

/**
 * GET inventory by userId
 * /inventory?userId=123
 */
router.get("/inventory", async (req, res) => {
  const { userId } = req.query;
  console.log("Fetching inventory for userId:", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const inventory = await prisma.inventory.findMany({
      where: { userId: Number(userId) },
      include: { item: true }
    });

    return res.status(200).json({
      inventory: inventory.map(i => ({
        itemName: i.item.itemName,
        quantity: i.quantity
      }))
    });
  } catch (error) {
    console.error("Inventory error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

/**
 * GET balance
 * /:userId/balance
 */
router.get("/:userId/balance", async (req, res) => {
  const userId = Number(req.params.userId);
  console.log("Fetching balance for userId:", userId);

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { balance: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error("Balance error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

/**
 * POST mine
 * cooldown: 5 minutes
 */
const COOLDOWN = 5 * 60 * 1000;

router.post("/mine", async (req, res) => {
  const discordId = req.body.userId;
  if (!discordId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { discord_uid: discordId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const lastMine = user.lastMine ? user.lastMine.getTime() : 0;
    const now = Date.now();

    if (now - lastMine < COOLDOWN) {
      return res.status(429).json({
        error: "Cooldown active",
        remaining: Math.ceil((COOLDOWN - (now - lastMine)) / 1000)
      });
    }

    // Perform mining
    const minedItemIds = mineItems(items, 100);

    const itemCounts = {};
    for (const id of minedItemIds) {
      itemCounts[id] = (itemCounts[id] || 0) + 1;
    }

    const minedSummary = Object.entries(itemCounts).map(([id, quantity]) => {
      const item = items.find(i => i.id == id);
      return {
        id: Number(id),
        name: item?.name ?? "Unknown",
        quantity
      };
    });

    // Transaction: update lastMine + inventory
    await prisma.$transaction(async tx => {
      await tx.user.update({
        where: { userId: user.userId },
        data: { lastMine: new Date() }
      });

      for (const mined of minedSummary) {
        await tx.inventory.upsert({
          where: {
            userId_itemId: {
              userId: user.userId,
              itemId: mined.id
            }
          },
          update: {
            quantity: { increment: mined.quantity }
          },
          create: {
            userId: user.userId,
            itemId: mined.id,
            quantity: mined.quantity
          }
        });
      }
    });

    return res.status(200).json({ minedItems: minedSummary });
  } catch (error) {
    console.error("Mining error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
