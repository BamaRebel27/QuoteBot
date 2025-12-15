const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

// Where to store your quotes.
const quotesFilePath = 'quotes.json';

// Command to get a random quote: /aquote
module.exports = {
    globalCooldown: 600,
    data: new SlashCommandBuilder()
        .setName('aquote')
        .setDescription('Sends a quote!')
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Number of quote to be replied!')
                .setMinValue(1)
                .setMaxValue(quoteTotal)
                .setRequired(true)),
    async execute(interaction) {
        // Load jsonData
        const quotesJsonData = JSON.parse(fs.readFileSync(quotesFilePath));

        // Get number string and check it. Then convert to a variable
        const quoteIdInput = interaction.options.getNumber('number');
        var quoteIndex;
        const quoteTotal = quotesJsonData.length

        if (quoteIdInput <= quoteTotal && quoteIdInput >= 1) {
            quoteIndex = Number(quoteIdInput);
            await interaction.deferReply()
        } else {
            await interaction.reply({
                content: `The input must be a number 1-${quoteTotal}!`,
                flags: MessageFlags.Ephemeral
            })
            return;
        }

        
        var quoteID = quoteIndex--

        // const data for the embed
        const author = (quotesJsonData[quoteIndex].author);
        const quote = (quotesJsonData[quoteIndex].quote);

        // const for embed data
        const quote_addedEmbed = new EmbedBuilder()
        .setColor(0xb07a70)
        .setTitle(`Stored Quote - #${quoteID}`)
        .setDescription(`"*${quote}*" - ${author}`)

        interaction.editReply({ embeds: [quote_addedEmbed] });
    }
};


