const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Where to store your quotes.
const quotesFilePath = 'quotes.json';

// Command to get a random quote: /quote
module.exports = {
    cooldown: 600,
    data: new SlashCommandBuilder()
        .setName('rquote')
        .setDescription('Sends a random quote!'),
    async execute(interaction) {
        await interaction.deferReply()
        // Load jsonData
        const quotesJsonData = JSON.parse(fs.readFileSync(quotesFilePath));

        // Random ID Generator
        const minQuoteId = 1;
        const maxQuoteId = (quotesJsonData.length + 1)

        let randomQuoteIndex = Math.floor(Math.random() * (maxQuoteId - minQuoteId)) + minQuoteId;
        let randomQuoteId = randomQuoteIndex--
        
        // const data for the embed
        const author = (quotesJsonData[randomQuoteIndex].author);
        const quote = (quotesJsonData[randomQuoteIndex].quote);
        
        // const for embed data
        const quote_addedEmbed = new EmbedBuilder()
        .setColor(0xb07a70)
        .setTitle(`Random Quote - #${randomQuoteId}`)
        .setDescription(`"*${quote}*" - ${author}`)
        
        await interaction.editReply({ embeds: [quote_addedEmbed] });

    }
};
