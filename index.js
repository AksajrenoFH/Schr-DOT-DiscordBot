import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";

// Ngebuat bot

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on(Events.ClientReady, readyClient => {
    console.log(`Bot bernama ${readyClient.user.tag} telah aktif/online!`);
})

// Ngucap P, owner sma member

const saidP = new Set()

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === 'p' && message.author.id !== process.env.OWNER_ID) {
        message.reply('Salam yang bener 😡');
        saidP.add(message.author.id);
        
        setTimeout(() => {
            saidP.delete(message.author.id);
        }, 15000);
        return;
    } 
    
    if (message.content === 'p' && message.author.id === process.env.OWNER_ID) {
        message.reply('||O MAY GAD! ADA OWNER GW JIR!|| H-halo bos');
        return;
    }

    if (saidP.has(message.author.id) && message.content.includes('gitu')) {
        message.reply('Biarin wleeek😜');
    }
});

// Load Commands
client.commands = new Collection();
async function loadCommands(){
    // Load Command Folder Main

    const mainPath = path.join(process.cwd(), 'commands/main');
    const mainFiles = fs.readdirSync(mainPath).filter(file => file.endsWith('.js'));

    for(const main of mainFiles){
        const command = await import(`./commands/main/${main}`);
        console.log(`Loaded Main command: ${command.default.name}`);
        client.commands.set(command.default.name, command.default);
    }

    // Load Command Folder RPG

    const rpgPath = path.join(process.cwd(), 'commands/RPG');
    const rpgFiles = fs.readdirSync(rpgPath).filter(file => file.endsWith('.js'));

    for (const rpg of rpgFiles){
        const command = await import(`./commands/RPG/${rpg}`);
        console.log(`Loaded RPG command: ${command.default.name}`);
        client.commands.set(command.default.name, command.default);
    }
}

await loadCommands();

// Event Handler

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    console.log(`Command received: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);
    if(!command) {
        console.log(`❌ Command ${interaction.commandName} tidak ditemukan!`);
        return interaction.reply({
            content: 'Command tidak ditemukan di bot 😢',
            ephemeral: true
        });
    }

    try{
        await command.execute(interaction);
    } catch(e){
        console.error(`❌ Error saat jalanin ${interaction.commandName}:`, e);
        if(interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'Adooooh ada yang error nih😢',
                ephemeral: true
            })
        } else{
            await interaction.reply({
                content: 'Adooooh ada yang error nih😢',
                ephemeral: true
            })
        }
    }
});


// Token Bot

client.login(process.env.TOKEN);