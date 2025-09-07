import fs from 'fs';
import path from 'path';
import { EmbedBuilder } from 'discord.js';

const dataPath = path.join(process.cwd(), 'data', 'player.json');

function loadPlayers(){
    if(!fs.existsSync(dataPath)){
        fs.writeFileSync(dataPath, JSON.stringify({}, null, 2))
    }
    return JSON.parse(fs.readFileSync(dataPath));
}

function savePlayers(players){
    fs.writeFileSync(dataPath, JSON.stringify(players, null, 2))
}

export default{
    name: 'profile',
    description: 'Show RPG Profile Stats',

    async execute(interaction){
        const players = loadPlayers();
        const userId = interaction.user.id;

        if(!players[userId]){
            players[userId] = {
                level: 1,
                exp: 0,
                hp: 250,
                atk: 100,
                gold: 0,
                hunt: 0,
                inventory: ['Copper Sword'],
            }
            savePlayers(players);
        }

        const p = players[userId];

        const embed = new EmbedBuilder()
            .setColor(0xFF9A00)
            .setTitle(`📜Profil ${interaction.user.username}📜`)
            .addFields(
                { name: '🛡️ Level', value: `${p.level} \n`},
                { name: '❤️ HP', value: `${p.hp} \n`},
                { name: '⚔️ ATK', value: `${p.atk} \n`},
                { name: '💰 Gold', value: `${p.gold} Gold \n`},
                { name: '💼 Inventory', value: `${p.inventory.length} Item \n`}
            )
            .setFooter({ text: `Ini masih veris Beta ya...`})

        await interaction.reply({ embeds: [embed] });
    }
}