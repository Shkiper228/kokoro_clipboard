const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm');

const leave = new Command(client, {
    name: 'leave',
    description: 'Дає вказівку боту, аби він покинув голосовий канал, у якому знаходиться',
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
    } else {
        
        if (client.player.getQueue(client.guild)) client.player.getQueue(client.guild).setPaused();
        
        await memberBot.voice.disconnect();
    }
})

module.exports = leave;