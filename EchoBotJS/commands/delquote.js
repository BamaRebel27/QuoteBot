const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const fs = require('fs');

// Where to store your quotes.
const quotesFilePath = 'quotes.json';

// Command to delete a quote from 'quotes.json'
module.exports = {
    data: new SlashCommandBuilder()
        .setName('delquote')
        .setDescription('Deletes a quote from storage!')
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('What quote number you want to delete!')
                .setRequired(true)),
        
    async execute(interaction) {

        // Const for role and checking if member has role to execute command
        const requiredRoleId = '1445508130430648331'

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have the required role!', flags: MessageFlags.Ephemeral })
        }

        // Const for data
        let quotesJsonData = JSON.parse(fs.readFileSync(quotesFilePath));

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

        const quoteArray = quotesJsonData

        let indexContent = quoteArray[quoteIndex]

        const index = quoteArray.indexOf(indexContent)

        if (index > -1) {
            quoteArray.splice(index, 1)
        }

        const newQuoteArray = JSON.stringify(quoteArray, null, 2)
        fs.writeFileSync(quotesFilePath, newQuoteArray)

        await interaction.editReply({ content: `Quote #${quoteID} has been deleted!`})
    }
}
