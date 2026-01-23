const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    aliases: ['commands', 'h'],
    description: 'List all available commands or get info about a specific one.',
    async execute(message, args) {
        const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));
        const prefix = 'rc';

        // If user requests info about a specific command
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const commandFile = commandFiles.find(file => file.replace('.js', '') === commandName);
            if (!commandFile) return message.reply('❌ Command not found.');

            const command = require(`./${commandFile}`);
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`📘 Command: ${prefix} ${command.name}`)
                .setDescription(command.description || 'No description provided.')
                .addFields(
                    { name: 'Aliases', value: command.aliases ? command.aliases.join(', ') : 'None', inline: true },
                    { name: 'Usage', value: `\`${prefix} ${command.name}\``, inline: true }
                )
                .setFooter({ text: `Requested by ${message.author.username}` });

            return message.reply({ embeds: [embed] });
        }

        // Otherwise, list all commands
        const commands = commandFiles.map(file => {
            const command = require(`./${file}`);
            return {
                name: command.name || 'Unknown',
                description: command.description || 'No description available',
                aliases: command.aliases ? command.aliases.join(', ') : 'None'
            };
        });

        const embed = new EmbedBuilder()
            .setColor('Aqua')
            .setTitle('🧭 RCS Bot Help Menu')
            .setDescription('Use `rc help <command>` to get detailed info about a specific command.\n')
            .addFields(
                commands.map(cmd => ({
                    name: `💠 ${prefix} ${cmd.name}`,
                    value: `**Description:** ${cmd.description}\n**Aliases:** ${cmd.aliases}`,
                    inline: false
                }))
            )
            .setFooter({ text: `Requested by ${message.author.username}` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
