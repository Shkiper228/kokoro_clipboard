const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');

const div = new Command(client, {
    name: 'div',
    description: 'Команда для гадання',
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
            hexColor: '#004B4B'
        }]})
})
div
module.exports = div;