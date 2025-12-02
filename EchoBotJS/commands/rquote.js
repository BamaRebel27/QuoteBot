const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Command to get a random quote: /quote
module.exports = {
    cooldown: 600,
    data: new SlashCommandBuilder()
        .setName('rquote')
        .setDescription('Sends a random quote!'),
    async execute(interaction) {
        await interaction.deferReply()
        // Load jsonData
        const data = JSON.parse(fs.readFileSync('quotes.json'));

        // Random ID Generator
        const min = 1;
        const max = (data.length + 1)

        let randomNum = Math.floor(Math.random() * (max - min)) + min;
        let i = randomNum--
        
        // const data for the embed
        const author = (data[randomNum].author);
        const quote = (data[randomNum].quote);
        
        // const for embed data
        const quote_addedEmbed = new EmbedBuilder()
        .setColor(0xb07a70)
        .setTitle(`Random Quote - #${i}`)
        .setDescription(`"*${quote}*" - ${author}`)
        
        await interaction.editReply({ embeds: [quote_addedEmbed] });

    }
};
