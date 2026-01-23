const { EmbedBuilder } = require('discord.js');
const db = require('../connection');
// =======================
// Mining Loot System
// =======================
const items = [
  { id: 1, name: "Stone", weight: 40.0 },
  { id: 2, name: "Coal", weight: 30.0 },
  { id: 3, name: "Iron", weight: 24.0 },
  { id: 4, name: "Copper", weight: 28.0 },
  { id: 5, name: "Aluminum", weight: 25.0 },
  { id: 6, name: "Silicon", weight: 25.0 },
  { id: 7, name: "Silver", weight: 9.0 },
  { id: 8, name: "Gold", weight: 5.0 },
  { id: 9, name: "Platinum", weight: 0.2 },
  { id: 10, name: "Diamond", weight: 0.08 },
  { id: 11, name: "Uranium", weight: 0.01 },
];

// =======================
// Weighted Mining Function
// =======================
function mineItems(items, count = 3, unique = false) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const results = [];

  for (let i = 0; i < count; i++) {
    let rand = Math.random() * totalWeight;

    for (let item of items) {
      rand -= item.weight;
      if (rand <= 0) {
        if (unique) {
          if (!results.includes(item.id)) results.push(item.id);
        } else {
          results.push(item.id);
        }
        break;
      }
    }
  }

  return results;
}

// =======================
// Discord Command
// =======================
const COOLDOWN = 5 * 60 * 1000; // 5 minutes

module.exports = {
  name: 'mine',
  aliases: ['m'],
  description: 'Mine resources',
  async execute(message, args) {
    const discordId = message.author.id;

    db.query("SELECT userId, lastMine FROM user WHERE discord_uid = ?", [discordId], (err, results) => {
      if (err) return message.reply("❌ Database error while fetching profile.");
      if (!results.length) return message.reply("❌ User not found. Register first.");

      const userId = results[0].userId;
      const lastMine = results[0].lastMine ? new Date(results[0].lastMine).getTime() : 0;
      const now = Date.now();

      if (now - lastMine < COOLDOWN) {
        const remaining = Math.ceil((COOLDOWN - (now - lastMine)) / 1000);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        return message.reply(`⏳ You must wait **${minutes}m ${seconds}s** before mining again.`);
      }

      db.query("UPDATE user SET lastMine = NOW() WHERE userId = ?", [userId], (err) => {
        if (err) console.error("Failed to update lastMine:", err);
      });

      const minedItemIds = mineItems(items, 100);
      const itemCounts = {};
      minedItemIds.forEach(id => itemCounts[id] = (itemCounts[id] || 0) + 1);

      const minedSummary = Object.entries(itemCounts).map(([id, qty]) => {
        const item = items.find(i => i.id == id);
        return { id: Number(id), name: item?.name || 'Unknown', quantity: qty };
      });

      const insertValues = minedSummary.map(item => [userId, item.id, item.quantity]);
      const insertSql = `
        INSERT INTO inventory (userId, itemId, quantity)
        VALUES ?
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `;
      db.query(insertSql, [insertValues], (err) => {
        if (err) console.error("Failed to insert mined items:", err);
      });

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('⛏️ Mining Results')
        .setDescription(minedSummary.map(i => `🔹 **${i.name}** ×${i.quantity}`).join('\n'))
        .setFooter({ text: `Requested by ${message.author.username}` });

      message.reply({ embeds: [embed] });
    });
  }
};
