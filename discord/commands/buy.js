// commands/buy.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');

module.exports = {
    name: 'buy',
    description: 'Buy an item from the market using its ID',
    async execute(message, args) {
        if (args.length < 2) return message.reply('Usage: rc buy <marketId> <quantity>');

        const marketId = parseInt(args[0]);
        const quantity = parseInt(args[1]);
        const discordId = message.author.id;

        if (isNaN(marketId) || isNaN(quantity) || quantity <= 0) return message.reply('❌ Invalid input.');

        // Get buyer's userId and balance
        const sqlProfile = "SELECT userId, balance FROM user WHERE discord_uid = ?";
        db.query(sqlProfile, [discordId], (err, results) => {
            if (err) return message.reply('❌ Database error.');
            if (!results.length) return message.reply('❌ User not found.');

            const buyerId = results[0].userId;
            let balance = results[0].balance;

            // Get market listing
            const marketSql = `
                SELECT * FROM market WHERE marketId = ?
            `;
            db.query(marketSql, [marketId], (err, results) => {
                if (err) return message.reply('❌ Database error.');
                if (!results.length) return message.reply('❌ Market listing not found.');

                const listing = results[0];

                if (quantity > listing.quantity) return message.reply(`❌ Only ${listing.quantity} available.`);

                const totalPrice = quantity * listing.pricePerItem;
                if (balance < totalPrice) return message.reply(`❌ You need ${totalPrice} RC but have ${balance} RC.`);

                // Deduct balance from buyer
                const updateBuyerBalance = `
                    UPDATE user SET balance = balance - ? WHERE userId = ?
                `;
                db.query(updateBuyerBalance, [totalPrice, buyerId], (err) => {
                    if (err) return message.reply('❌ Failed to update balance.');

                    // Add money to seller
                    const updateSellerBalance = `
                        UPDATE user SET balance = balance + ? WHERE userId = ?
                    `;
                    db.query(updateSellerBalance, [totalPrice, listing.sellerId], (err) => {
                        if (err) return message.reply('❌ Failed to pay seller.');

                        // Add item to buyer's inventory
                        const addInventory = `
                            INSERT INTO inventory (userId, itemId, quantity)
                            VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE quantity = quantity + ?
                        `;
                        db.query(addInventory, [buyerId, listing.itemId, quantity, quantity], (err) => {
                            if (err) return message.reply('❌ Failed to add items to inventory.');

                            // Update market listing
                            let newQuantity = listing.quantity - quantity;
                            if (newQuantity <= 0) {
                                db.query(`DELETE FROM market WHERE marketId = ?`, [marketId]);
                            } else {
                                db.query(`UPDATE market SET quantity = ? WHERE marketId = ?`, [newQuantity, marketId]);
                            }

                            const embed = new EmbedBuilder()
                                .setColor('Gold')
                                .setTitle('💸 Market Purchase')
                                .setDescription(`You bought **${quantity} ${listing.itemId}** for **${totalPrice} RC**!`)
                                .setFooter({ text: `Buyer: ${message.author.username}` });

                            message.reply({ embeds: [embed] });
                        });
                    });
                });
            });
        });
    }
};
