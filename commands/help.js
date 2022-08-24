const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const fs = require('fs');

const help = new Command(client, {
    name: 'help',
    description: 'Команда для допомоги з командами(яку ви щойно написали)',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    
        let description = '';
        client.commands.forEach((command, index) => {
            description += `${index + 1}. ${client.commands[index].name}\n**${client.commands[index].description}**\n\`${client.commands[index].syntax}\`\n\n`;
        });

        await message.channel.send({embeds: [{
            title: 'Команди',
            description: description,
            hexColor: 0x004B4B
        }]})
})

module.exports = help;