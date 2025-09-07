import { SlashCommandBuilder, REST, Routes } from "discord.js";
import 'dotenv/config';

// Daftar semua slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Show RPG Profile Stats')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('hunt')
        .setDescription('Hunt for monsters to gain EXP and Gold')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Lihat atau beli item di toko RPG')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Pilih aksi')
                .setRequired(true)
                .addChoices(
                    { name: 'List Items', value: 'list' },
                    { name: 'Buy Item', value: 'buy' }
                )
        )
        .addStringOption(option => 
            option.setName('category')
                .setDescription('Kategori item')
                .setRequired(false)
                .addChoices(
                    { name: 'Potion', value: 'potion' },
                    { name: 'Armor', value: 'armor' },
                    { name: 'Sword', value: 'sword' }
                )
        )
        .addStringOption(option => 
            option.setName('item')
                .setDescription('Item yang ingin dibeli')
                .setRequired(false)
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Deploying slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Commands deployed successfully!');
    } catch (error) {
        console.error('❌ Failed to deploy commands:', error);
    }
})();
