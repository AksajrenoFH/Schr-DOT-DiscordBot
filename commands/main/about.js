import { EmbedBuilder } from "discord.js";

export default {
    name: 'about',
    description: 'Information about the bot',

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFF9A00)
            .setTitle('About Me')
            .setDescription('Bot Discord RPG yang bisa digunakan untuk bermain!')
            .setFields(
                { name: '🐈 Nama', value: 'SchröDOT', inline: true },
                { name: '🤖 Type', value: 'Discord Bot', inline: true },
                { name: '⚙️ Version', value: '1.0.0', inline: true },
                { name: '👤 Author', value: 'Secret', inline: true },
                { name: '🌐 Language', value: 'Bahasa Indonesia', inline: true },
                { name: '🖥️ Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true },
                { name: '🛠️ Dev Stage', value: 'Beta', inline: false }
            )
            .setFooter({
                text: `Command by ${interaction.user.username}`
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
