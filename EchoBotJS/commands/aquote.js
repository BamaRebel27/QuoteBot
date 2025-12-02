const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

// Command to get a random quote: /aquote
module.exports = {
    cooldown: 600,
    data: new SlashCommandBuilder()
        .setName('aquote')
        .setDescription('Sends a quote!')
        .addStringOption(option =>
            option.setName('number')
                .setDescription('Number of quote to be replied!')
                .setRequired(true)),
    async execute(interaction) {
        // Load jsonData
        const data = JSON.parse(fs.readFileSync('quotes.json'));

        // Get number string and check it. Then convert to a variable
        const numberInput = interaction.options.getString('number');
        var quoteID;

        if (!isNaN(Number(numberInput)) && numberInput <= quoteTotal && numberInput >= 1) {
            quoteID = Number(numberInput);
            await interaction.deferReply()
        } else {
            await interaction.reply({
                content: `The input must be a number 1-${quoteTotal}!`,
                flags: MessageFlags.Ephemeral
                
            })
            return;
        }
        
        var i = quoteID--

        // const data for the embed
        const author = (data[quoteID].author);
        const quote = (data[quoteID].quote);

        // const for embed data
        const quote_addedEmbed = new EmbedBuilder()
        .setColor(0xb07a70)
        .setTitle(`Stored Quote - #${i}`)
        .setDescription(`"*${quote}*" - ${author}`)

        interaction.editReply({ embeds: [quote_addedEmbed] });
    }
};




