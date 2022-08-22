const { MessageEmbed } = require('discord.js');
const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm');

const queuE = new Command(client, {
    name: 'queue',
    description: 'Відображення треків черги',
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
        const tracks = queue.tracks;

        const fields = [];
        if(tracks[0]){
            tracks.forEach((track, index) => {
                fields.push({
                    name: `_-/|*${index + 1}.|\\-*_`,
                    value: `\`${track.title}\nТривалість:\n${track.duration}\`\n\n`
                })
            });
        }
        
        if(fields[0]){
            await message.channel.send({embeds: [{
                title: 'Черга',
                description: `Зараз грає:\n\`${queue.current.title}\nТривалість:\n${queue.current.duration}\`\n\n**Наступне:**\n\n`,
                fields: fields
            }]})
        } else {
            await message.channel.send({embeds: [{
                title: 'Черга',
                description: `Зараз грає:\n\`${queue.current.title}\nТривалість:\n${queue.current.duration}\`\n\n`,
                fields: fields
            }]})
        }
        
    }
})

module.exports = queuE;