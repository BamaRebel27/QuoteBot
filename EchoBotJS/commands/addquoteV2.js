const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

// Where to store your quotes... Make a file name.json, name cane be whatever you choose, the file contents should be an empty [].
const quotesFilePath = 'quotes.json';

// Command to add a new quote: /addquote
module.exports = {
    userCooldown: 60,
    data: new SlashCommandBuilder()
        .setName('addquote')
        .setDescription('Add a quote to database')
        .addStringOption(option =>
            option.setName('quote')
                .setDescription('Quote to be added!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('author')
                .setDescription('Author of quote!')
                .setRequired(true)),
     async execute(interaction) {

        // Const for role and checking if member has role to execute command
        const requiredRoleId = '1445508130430648331'
        
        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have the required role!', flags: MessageFlags.Ephemeral })
        }

        try {
            // Strings for JS object
            const quote = interaction.options.getString('quote');
            const author = interaction.options.getString('author')

            // Loading quotes.json
            const quotesJsonData = JSON.parse(fs.readFileSync(quotesFilePath));

            // Array of objects for jsonString
            const newQuote = [
                { quote: quote, author: author }
            ];

            // Get new quoteID
            let quoteTotal = quotesJsonData.length
            let quoteID = ++quoteTotal

            // const for embed data
            const quote_addedEmbed = new EmbedBuilder()
            .setColor(0xb07a70)
            .setTitle(`Quote Successfully Added - #${quoteID}`)
            .setDescription(`"*${quote}*" - ${author}`)

            // Function to add data to the JSON file
            async function addToArrayInJsonFile(newData) {
                try {
                    let existingQuotes = [];
            
                    // 1. Read the existing JSON file
                    if (fs.existsSync(quotesFilePath)) {
                        existingQuotes = quotesJsonData
                    } else {
                        return interaction.reply({ content: 'The storage file is missing!', flags: MessageFlags.Ephemeral})
                    }
            
                    // 3. Append the new data
                    existingQuotes.push(...newData); // Using spread syntax to add multiple items
            
                    // 4. Convert the updated array back to a JSON string
                    const updatedQuotes = JSON.stringify(existingQuotes, null, 2); // null, 2 for pretty printing
            
                    // 5. Write the updated JSON string back to the file
                    await fs.promises.writeFile(quotesFilePath, updatedQuotes, 'utf8');
                    await interaction.reply({ embeds: [quote_addedEmbed] });
            
                } catch (error) {
                    await interaction.reply('Error saving quote:', error);
                }
            }

            addToArrayInJsonFile(newQuote);

    
        } catch (error) {
        console.error(`Error executing command: ${error.message}`);
     }
    
}};

