const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const { start } = require('repl');
require('dotenv').config();

// Where to store your quotes.
const quotesFilePath = process.env.QUOTES_FILE

// Load jsonData
const quotesJsonData = JSON.parse(fs.readFileSync(quotesFilePath));

const quoteTotal = Number(quotesJsonData.length)


// Command to get a random quote: /aquote
module.exports = {
    globalCooldown: 600,
    data: new SlashCommandBuilder()
        .setName('list-quotes')
        .setDescription('Sends a list of quotes! Max 25 quotes at a time!')
        .addNumberOption(option =>
            option.setName('start-quoteid')
                .setDescription('Number of quotes to start at!')
                .setMinValue(1)
                .setMaxValue(quoteTotal)
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('end-quoteid')
                .setDescription('Number of quote to end at!')
                .setMinValue(1)
                .setMaxValue(quoteTotal)
                .setRequired(true)),
    async execute(interaction) {

        // Const for role and checking if member has role to execute command
        const requiredRoleId = '1445508130430648331'
        
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have the required role!', flags: MessageFlags.Ephemeral })
        }

        let quoteArray = [...quotesJsonData]

        // List-Quotes max and min ids as const
        const startQuoteID = interaction.options.getNumber('start-quoteid')
        const endQuoteID = interaction.options.getNumber('end-quoteid')

        const startQuoteIndex = startQuoteID - 1
        const endQuoteIndex = (endQuoteID - startQuoteID) + 1
        
        if (endQuoteIndex <= 25 && endQuoteIndex >= 1) {
            await interaction.deferReply()
        } else {
            return interaction.reply({ content: 'Invalid amount of quotes!', flags: MessageFlags.Ephemeral })
        }

        // Get quotes for list
        const quotesToList = quoteArray.splice(startQuoteIndex, endQuoteIndex)

        // const for embed data
        const quote_listEmbed = new EmbedBuilder()
        .setColor(0xb07a70)
        .setTitle(`Quotes List ${startQuoteID}-${endQuoteID}`)
        .addFields(
            quotesToList.flatMap((quotes, index) => [
                { name: `Quote #${index + startQuoteID}` , value : `"*${quotes.quote}*" - ${quotes.author}`},
            ])
        )
            
           
        
        
        await interaction.followUp({ embeds: [quote_listEmbed] });
        quoteArray = [...quotesJsonData]
        //await interaction.editReply('Testing...')
        //console.log(quoteToList)

        
    }
}
