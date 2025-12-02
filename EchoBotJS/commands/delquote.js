const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const fs = require('fs');

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
        let data = JSON.parse(fs.readFileSync('quotes.json'));

        // Get number string and check it. Then convert to a variable
        const numberInput = interaction.options.getNumber('number');
        var quoteID;
        const quoteTotal = data.length

        if (numberInput <= quoteTotal && numberInput >= 1) {
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
        
        // Removing the quote and rewriting the .json
        const quoteArray = data

        let indexContent = quoteArray[quoteID]

        const index = quoteArray.indexOf(indexContent)

        if (index > -1) {
            quoteArray.splice(index, 1)
        }

        const newQuoteArray = JSON.stringify(quoteArray, null, 2)
        fs.writeFileSync('quotes.json', newQuoteArray)

        
        await interaction.editReply({ content: `Quote #${i} has been deleted!`})
        

    }
}
