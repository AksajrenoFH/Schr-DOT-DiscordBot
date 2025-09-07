import fs from 'fs';
import path from 'path';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

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

const shopItems = {
    potion: [
        { emoji: '💗', name: 'Lesser Healing', price: 40, effect: { rec: 50 }, req: (p) => p.hunt >= 3 },
        { emoji: '❤️', name: 'Healing', price: 120, effect: { rec: 100 }, req: (p) => p.hp >= 300 },
        { emoji: '❤️‍🔥', name: 'Greater Healing', price: 220, effect: { rec: 200 }, req: (p) => p.hp >= 550 },
        { emoji: '💖', name: 'Super Healing', price: 350, effect: { rec: 400 }, req: (p) => p.hp >= 750 },
        { emoji: '💝', name: 'Supreme Healing', price: 500, effect: { rec: 600 }, req: (p) => p.hp >= 950 },
    ],
    armor: [
        { emoji: '🟫', name: 'Copper Armor', price: 180, effect: { hp: 50 }, req: (p) => p.level >= 2 },
        { emoji: '⚪', name: 'Iron Armor', price: 300, effect: { hp: 100 }, req: (p) => p.level >= 3 },
        { emoji: '🩶', name: 'Silver Armor', price: 450, effect: { hp: 150 }, req: (p) => p.level >= 4 },
        { emoji: '🔷', name: 'Diamond Armor', price: 700, effect: { hp: 200 }, req: (p) => p.level >= 5 },
    ],
    sword: [
        { emoji: '🗡️', name: 'Iron Sword', price: 120, effect: { atk: 25 }, req: (p) => p.level >= 1 && p.hunt >= 15 },
        { emoji: '⚔️', name: 'Silver Sword', price: 200, effect: { atk: 85 }, req: (p) => p.level >= 2 },
        { emoji: '💠', name: 'Diamond Sword', price: 500, effect: { atk: 150 }, req: (p) => p.level >= 4 },
    ]
};

export default {
    name: 'shop',
    description: 'Lihat atau beli item di toko RPG',
    
    data: new SlashCommandBuilder()
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
        ),

    async execute(interaction){
        const players = loadPlayers();
        const userId = interaction.user.id;

        const action = interaction.options.getString('action');
        const category = interaction.options.getString('category');
        const itemName = interaction.options.getString('item');

        if(action === 'list'){
            if(!category) return interaction.reply({ content: 'Pilih kategori untuk menampilkan item!', ephemeral: true });
            const items = shopItems[category];
            if(!items) return interaction.reply({ content: 'Kategori tidak ditemukan!', ephemeral: true });

            const embed = new EmbedBuilder()
                .setTitle(`🛒 Toko RPG SchröDOT - ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                .setColor(0xFF9A00)
                .setDescription('Daftar item beserta harga dan syarat unlock:')
                .addFields(
                    items.map(i => ({ name: `${i.emoji} ${i.name}`, value: `💰 ${i.price} Gold | 🔓 Req: ${i.req.toString()}`, inline: false }))
                )
                .setFooter({ text: 'Gunakan /shop action:buy untuk membeli item' });

            return interaction.reply({ embeds: [embed] });
        }

        if(action === 'buy'){
            if(!players[userId]) return interaction.reply({ content: 'Kamu belum punya profil! Jalankan /profile dulu.', ephemeral: true });
            if(!category || !itemName) return interaction.reply({ content: 'Kategori dan nama item harus diisi untuk membeli.', ephemeral: true });

            const shopCategory = shopItems[category];
            if(!shopCategory) return interaction.reply({ content: 'Kategori tidak ditemukan!', ephemeral: true });

            const item = shopCategory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            if(!item) return interaction.reply({ content: 'Item tidak ditemukan di kategori ini!', ephemeral: true });

            const p = players[userId];
            if(p.gold < item.price) return interaction.reply({ content: `Gold kamu tidak cukup! (${p.gold}/${item.price})`, ephemeral: true });

            p.gold -= item.price;
            if(!p.inventory) p.inventory = [];
            p.inventory.push(item.name);
            savePlayers(players);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(`🛒 ${interaction.user.username} membeli item!`)
                .setDescription(`Berhasil membeli **${item.name}** seharga 💰 ${item.price} Gold`)
                .addFields(
                    { name: "Sisa Gold", value: `${p.gold}`, inline: true },
                    { name: "Jumlah Inventory", value: `${p.inventory.length} Item`, inline: true }
                )
                .setFooter({
                    text: 'Terimakaish Sudah berbelanja di toko RPG SchröDOT! Janlup mampir lagi ya...'
                })

            return interaction.reply({ embeds: [embed] });
        }

        return interaction.reply({ content: 'Aksi tidak valid!', ephemeral: true });
    }
};
