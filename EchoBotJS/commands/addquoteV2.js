const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { json } = require('stream/consumers');

// Command to add a new quote: /addquote
module.exports = {
    cooldown: 60,
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
            const data = JSON.parse(fs.readFileSync('quotes.json'));

            // Array of objects for jsonString
            const newQuote = [
                { quote: quote, author: author }
            ];

            // Get new quoteID
            let i = data.length
            let quoteID = ++i

            // const for embed data
            const quote_addedEmbed = new EmbedBuilder()
            .setColor(0xb07a70)
            .setTitle(`Quote Successfully Added - #${quoteID}`)
            .setDescription(`"*${quote}*" - ${author}`)

            // Function to add data to the JSON file
            async function addToArrayInJsonFile(newData) {
                try {
                    let existingData = [];
            
                    // 1. Read the existing JSON file
                    if (fs.existsSync('quotes.json')) {
                        const fileContent = await fs.promises.readFile('quotes.json', 'utf8');
                        // 2. Parse the content into a JavaScript array
                        existingData = JSON.parse(fileContent);
                    }
            
                    // 3. Append the new data
                    existingData.push(...newData); // Using spread syntax to add multiple items
            
                    // 4. Convert the updated array back to a JSON string
                    const updatedJsonString = JSON.stringify(existingData, null, 2); // null, 2 for pretty printing
            
                    // 5. Write the updated JSON string back to the file
                    await fs.promises.writeFile('quotes.json', updatedJsonString, 'utf8');
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

