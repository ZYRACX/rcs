// commands/search.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');
const ITEM_ALIASES = require('../itemAliases'); // same alias file used in quicksell/list

function getCanonicalItemName(input) {
    input = input.toLowerCase();
    for (const [canonical, aliases] of Object.entries(ITEM_ALIASES)) {
        if (aliases.includes(input)) return canonical;
    }
    return null;
}

module.exports = {
    name: 'search',
    description: 'Search the market for a specific item',
    async execute(message, args) {
        if (args.length < 1) return message.reply('Usage: rc search <itemName>');

        const itemInput = args[0];
        const itemName = getCanonicalItemName(itemInput);
        if (!itemName) return message.reply('❌ Invalid item name.');

        // Query database for item listings
        const sql = `
            SELECT m.marketId, u.discord_uid, i.itemName, m.quantity, m.pricePerItem
            FROM market m
            JOIN user u ON m.sellerId = u.userId
            JOIN items i ON m.itemId = i.itemId
            WHERE LOWER(i.itemName) = ?
            ORDER BY m.pricePerItem ASC
            LIMIT 25
        `;
        db.query(sql, [itemName.toLowerCase()], (err, results) => {
            if (err) return message.reply('❌ Database error while searching the market.');
            if (!results.length) return message.reply(`📭 No listings found for **${itemName}**.`);

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`🔎 Market Listings for ${itemName}`)
                .setDescription(`Here are the current listings for **${itemName}** (sorted by price):`);

            results.forEach(r => {
                embed.addFields({
                    name: `ID: ${r.marketId} | ${r.itemName} x${r.quantity}`,
                    value: `Price: ${r.pricePerItem} RC`,
                    inline: false
                });
            });

            message.reply({ embeds: [embed] });
        });
    }
};
