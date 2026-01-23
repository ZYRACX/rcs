// commands/balance.js
const { EmbedBuilder } = require('discord.js');
const db = require('../connection');
module.exports = {
    name: 'balance',
    aliases: ['bal'],
    description: 'Check your current balance',
    async execute(message, args) {
        const discordId = message.author.id;

        if (!discordId) return message.reply("❌ Discord ID not found.");

        try {
            // 1️⃣ Get user balance from DB
            const sql = "SELECT balance FROM user WHERE discord_uid = ?";
            db.query(sql, [discordId], (err, results) => {
                if (err) {
                    console.error("Database error:", err);
                    return message.reply("❌ Database error while fetching balance.");
                }

                if (!results.length) return message.reply("❌ User not found. Please register first.");

                const balance = results[0].balance ?? 0;

                // 2️⃣ Build embed
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setTitle('💰 Balance')
                    .setDescription('Your current balance:')
                    .addFields(
                        { name: 'Balance', value: `${balance} RC`, inline: false }
                    )
                    .setFooter({ text: 'RCS 🪙' });

                // 3️⃣ Send embed
                message.reply({ embeds: [embed] });
            });

        } catch (error) {
            console.error(error);
            message.reply("❌ Something went wrong while fetching balance.");
        }
    }
};
