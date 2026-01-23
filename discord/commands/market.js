// commands/market.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');

module.exports = {
    name: 'market',
    description: 'View items listed on the market',
    async execute(message, args) {
        const sql = `
            SELECT m.marketId, u.discord_uid, i.itemName, m.quantity, m.pricePerItem
            FROM market m
            JOIN user u ON m.sellerId = u.userId
            JOIN items i ON m.itemId = i.itemId
            ORDER BY m.createdAt DESC
            LIMIT 25
        `;
        db.query(sql, (err, results) => {
            if (err) return message.reply('❌ Database error while fetching market.');
            if (!results.length) return message.reply('📭 No items listed in the market.');

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🛒 Market Listings')
                .setDescription('Here are the items currently for sale:');

            results.forEach(r => {
                embed.addFields({
                    name: `${r.itemName} x${r.quantity}`,
                    value: `Price: ${r.pricePerItem} RC | Seller: <@${r.discord_uid}> | ID: ${r.marketId}`,
                    inline: false
                });
            });

            message.reply({ embeds: [embed] });
        });
    }
};
