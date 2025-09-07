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

export default {
    name: 'hunt',
    description: 'Hunt for monsters to gain EXP and Gold',

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
        }

        const p = players[userId];

        const goldGained = Math.floor(Math.random() * 10) + 1; // 1-10 gold
        const expGained = Math.floor(Math.random() * 11) + 5; // 5-15 exp

        p.gold += goldGained;
        p.exp += expGained;
        p.hunt += 1;

        let expNeeded = p.level * 100 + 100;
        let lvlUpMSG = '';

        if(p.exp >= expNeeded){
            p.level += 1;
            p.exp = 0;
            p.hp += 100;
            p.atk += 50;
            lvlUpMSG = `\n 🎉 Kamu naik ke **Level ${p.level}**! \n ❤️ +100 HP \n ⚔️ +50 ATK`
        }

        savePlayers(players);

        const embed = new EmbedBuilder()
            .setColor(0xFF9A00)
            .setTitle(`🗡️ Perburuan oleh ${interaction.user.username}`)
            .setDescription(`Kamu mendapatkan: \n 💰 ${goldGained} Gold \n ⭐ ${expGained} EXP ${lvlUpMSG}`)
            .setFooter({ text: `Total Hunt: ${p.hunt} | Level: ${p.level} | EXP: ${p.exp}/${expNeeded}`})

        await interaction.reply({ embeds: [embed] });
    }
}
