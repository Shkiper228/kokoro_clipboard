const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm');

const skip = new Command(client, {
    name: 'skip',
    description: 'Пропуск дійсного музичного треку',
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
        const queue = client.player.getQueue(client.guild);
        queue.skip();
    }
})

module.exports = skip;