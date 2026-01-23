// commands/quicksell.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');

// Item aliases mapping
const ITEM_ALIASES = require('../itemAliases');

// Function to get canonical item name from input
function getCanonicalItemName(input) {
    input = input.toLowerCase();
    for (const [canonical, aliases] of Object.entries(ITEM_ALIASES)) {
        if (aliases.includes(input)) return canonical;
    }
    return null; // invalid item
}

module.exports = {
    name: 'quicksell',
    aliases: ['qs', 'sell'],
    description: 'Sell items from your inventory instantly',
    async execute(message, args) {
        const discordId = message.author.id;

        if (!discordId) return message.reply("❌ Discord ID not found.");
        if (args.length < 2) return message.reply('Usage: rc quicksell <itemName> <amount>');

        const inputName = args[0];
        const itemName = getCanonicalItemName(inputName);
        const amount = parseInt(args[1]);

        if (!itemName) return message.reply("❌ Invalid item name.");
        if (isNaN(amount) || amount <= 0) return message.reply('❌ Please provide a valid amount to sell.');

        try {
            // 1️⃣ Get userId
            const sqlProfile = "SELECT userId FROM user WHERE discord_uid = ?";
            db.query(sqlProfile, [discordId], (err, results) => {
                if (err) return message.reply('❌ Database error.');
                if (!results.length) return message.reply('❌ User not found. Please register first.');

                const userId = results[0].userId;

                // 2️⃣ Get inventory for this item
                const inventorySql = `
                    SELECT inventory.quantity, items.itemValue
                    FROM inventory
                    JOIN items ON inventory.itemId = items.itemId
                    WHERE inventory.userId = ? AND LOWER(items.itemName) = ?
                `;
                db.query(inventorySql, [userId, itemName], (err, results) => {
                    if (err) return message.reply('❌ Database error while fetching inventory.');
                    if (!results.length) return message.reply(`❌ You don’t have any **${itemName}**.`);

                    const itemData = results[0];
                    if (itemData.quantity < amount) return message.reply(`❌ You only have **${itemData.quantity}** ${itemName}.`);

                    // 3️⃣ Remove sold quantity from inventory
                    const updateSql = `
                        UPDATE inventory
                        SET quantity = quantity - ?
                        WHERE userId = ? AND itemId = (SELECT itemId FROM items WHERE LOWER(itemName) = ?)
                    `;
                    db.query(updateSql, [amount, userId, itemName], (err) => {
                        if (err) return message.reply('❌ Failed to update inventory.');

                        // 4️⃣ Add money to user balance
                        const totalValue = itemData.itemValue * amount;
                        const balanceSql = `
                            UPDATE user
                            SET balance = balance + ?
                            WHERE discord_uid = ?
                        `;
                        db.query(balanceSql, [totalValue, discordId], (err) => {
                            if (err) return message.reply('❌ Failed to update balance.');

                            // 5️⃣ Send embed
                            const embed = new EmbedBuilder()
                                .setColor('Gold')
                                .setTitle('💰 Quick Sell')
                                .setDescription(`You sold **${amount} ${itemName}** for **${totalValue} RC**!`)
                                .setFooter({ text: `Balance updated for ${message.author.username}` });

                            message.reply({ embeds: [embed] });
                        });
                    });
                });
            });

        } catch (error) {
            console.error(error);
            message.reply('❌ Something went wrong.');
        }
    }
};
