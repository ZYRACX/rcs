// commands/list.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');

// Item aliases (reuse from quicksell)
const ITEM_ALIASES = require('../itemAliases.js');

function getCanonicalItemName(input) {
    input = input.toLowerCase();
    for (const [canonical, aliases] of Object.entries(ITEM_ALIASES)) {
        if (aliases.includes(input)) return canonical;
    }
    return null;
}

module.exports = {
    name: 'list',
    description: 'List an item on the market',
    async execute(message, args) {
        const discordId = message.author.id;

        if (args.length < 3) {
            return message.reply('Usage: rc list <itemName> <quantity> <pricePerItem>');
        }

        const itemInput = args[0];
        const itemName = getCanonicalItemName(itemInput);
        const quantity = parseInt(args[1]);
        const pricePerItem = parseInt(args[2]);

        if (!itemName) return message.reply('❌ Invalid item name.');
        if (isNaN(quantity) || quantity <= 0) return message.reply('❌ Invalid quantity.');
        if (isNaN(pricePerItem) || pricePerItem <= 0) return message.reply('❌ Invalid price.');

        // Get userId
        const sqlProfile = "SELECT userId FROM user WHERE discord_uid = ?";
        db.query(sqlProfile, [discordId], (err, results) => {
            if (err) return message.reply('❌ Database error.');
            if (!results.length) return message.reply('❌ User not found.');

            const userId = results[0].userId;

            // Check if user has enough items
            const invSql = `
                SELECT inventory.quantity, items.itemId
                FROM inventory
                JOIN items ON inventory.itemId = items.itemId
                WHERE inventory.userId = ? AND LOWER(items.itemName) = ?
            `;
            db.query(invSql, [userId, itemName], (err, results) => {
                if (err) return message.reply('❌ Database error.');
                if (!results.length || results[0].quantity < quantity) {
                    return message.reply(`❌ You do not have enough **${itemName}** to list.`);
                }

                const itemId = results[0].itemId;

                // Deduct items from inventory
                const updateInventory = `
                    UPDATE inventory
                    SET quantity = quantity - ?
                    WHERE userId = ? AND itemId = ?
                `;
                db.query(updateInventory, [quantity, userId, itemId], (err) => {
                    if (err) return message.reply('❌ Failed to update inventory.');

                    // Add to market
                    const insertMarket = `
                        INSERT INTO market (sellerId, itemId, quantity, pricePerItem)
                        VALUES (?, ?, ?, ?)
                    `;
                    db.query(insertMarket, [userId, itemId, quantity, pricePerItem], (err) => {
                        if (err) return message.reply('❌ Failed to list item.');
                        
                        const embed = new EmbedBuilder()
                            .setColor('Blue')
                            .setTitle('📢 Item Listed')
                            .setDescription(`You listed **${quantity} ${itemName}** for **${pricePerItem} RC each**.`)
                            .setFooter({ text: `Seller: ${message.author.username}` });
                        
                        message.reply({ embeds: [embed] });
                    });
                });
            });
        });
    }
};
