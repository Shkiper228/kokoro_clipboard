const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm');

const stop = new Command(client, {
    name: 'stop',
    description: 'Команда для видалення музичної черги',
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const member = await client.guild.members.fetch(message.author.id);
    const memberBot = await client.guild.members.fetch(client.user.id);


    if(member.voice.channelId != memberBot.voice.channelId){
        new ErrorAlarm({
            description: 'Ви повинні бути в одному голосовому каналі з ботом, аби давати йому команди',
            timeout: 10,
            color: '#ffff00',
            channel: message.channel
        })
        return;
    } else if (client.player.getQueue(client.guild)) {
        client.player.deleteQueue(client.guild)
        await message.channel.send({embeds: [{
            description: `${member} знищив музичну чергу`,
            color: '#ff0000'
        }]})
    }
})

module.exports = stop;