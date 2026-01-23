// commands/inventory.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');
module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    description: 'Show user inventory',
    async execute(message, args) {
        const discordId = message.author.id;

        if (!discordId) return message.reply("❌ Discord ID not found.");

        try {
            // 1️⃣ Get userId from Discord ID
            const sqlProfile = "SELECT userId FROM user WHERE discord_uid = ?";
            db.query(sqlProfile, [discordId], (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return message.reply("❌ Database error while fetching profile.");
                }

                if (!results.length) return message.reply("❌ User not found. Please register first.");

                const userId = results[0].userId;

                // 2️⃣ Fetch inventory for that userId
                const sqlInventory = `
                    SELECT inventory.itemId, items.itemName, items.itemValue, inventory.quantity
                    FROM inventory
                    JOIN items ON inventory.itemId = items.itemId
                    WHERE inventory.userId = ?
                `;
                db.query(sqlInventory, [userId], (err, items) => {
                    if (err) {
                        console.error("Database error while fetching inventory:", err);
                        return message.reply("❌ Database error while fetching inventory.");
                    }

                    if (!items.length) return message.reply("📭 Your inventory is empty.");

                    // 3️⃣ Build embed
                    const embed = new EmbedBuilder()
                        .setColor('#ffcc00')
                        .setTitle(`📦 Inventory - ${message.author.username}`)
                        .setDescription("Here are your items:")
                        .setFooter({ text: 'RCS 🪙' });

                    items.forEach(item => {
                        embed.addFields({
                            name: item.itemName,
                            value: `${item.quantity}`,
                            inline: true
                        });
                    });

                    message.reply({ embeds: [embed] });
                });
            });
        } catch (error) {
            console.error(error);
            message.reply("❌ Something went wrong while fetching inventory.");
        }
    }
};
