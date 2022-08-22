const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const ErrorAlarm = require('../classes/ErrorAlarm');

const repeat = new Command(client, {
    name: 'repeat',
    description: 'Змінює режим повторення',
    syntax: `${client.config.prefix}repeat [вимкнути(n), одиночний(o), черга(q), авто(a)]`,
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const member = await client.guild.members.fetch(message.author.id);
    const memberBot = await client.guild.members.fetch(client.user.id);
    const queue = client.player.getQueue(client.guild);
    const tracks = queue.tracks;


    if(member.voice.channelId != memberBot.voice.channelId){
        new ErrorAlarm({
            description: 'Ви повинні бути в одному голосовому каналі з ботом, аби давати йому команди',
            timeout: 10,
            color: '#ffff00',
            channel: message.channel
        })
        return;
    } else {
        if(!args[0]) return;
        const queue = client.player.getQueue(client.guild)
        switch (args[0][0]) {
            case 'n':
                queue.setRepeatMode(0);
                await message.channel.send({
                    content: `${member}`,
                    embeds: [{
                        title: 'Повтор',
                        description: 'Режим повтору тепер: \`вимкнено\`'
                    }]})
                break;


            case 'o':
                const track = queue.nowPlaying();
                queue.setRepeatMode(1);
                await message.channel.send({
                    content: `${member}`,
                    embeds: [{
                        title: 'Повтор',
                        description: `Режим повтору тепер: \`один трек\`:\n**${track.title}**`,
                        fields: [{
                            name: 'Тривалість',
                            value: `${track.duration}`
                        }],
                        image: {
                            url:track.thumbnail,
                            height: 128,
                            width: 128
                        }
                    }]})
                break;


            case 'q':
                const fields = [];
                if(tracks[0]){
                    tracks.forEach((track, index) => {
                        fields.push({
                            name: `_-/|*${index + 1}.|\\-*_`,
                            value: `\`${track.title}\n**Тривалість:**\n${track.duration}\`\n\n`
                        })
                    });
                }
        
                
                queue.setRepeatMode(2);
                if(fields[0]){
                    await message.channel.send({embeds: [{
                        title: 'Черга',
                        description: `Режим повтору тепер: \`повтор черги\`\nЗараз грає:\n\`${queue.current.title}\nТривалість:\n${queue.current.duration}\`\n\n**Наступне:**\n\n`,
                        fields: fields
                    }]})
                } else {
                    await message.channel.send({embeds: [{
                        title: 'Черга',
                        description: `Режим повтору тепер: \`повтор черги\`\nЗараз грає:\n\`${queue.current.title}\nТривалість:\n${queue.current.duration}\`\n\n`,
                        fields: fields
                    }]})
                }
                break;


            case 'a':
                queue.setRepeatMode(3);
                await message.channel.send({
                    content: `${member}`,
                    embeds: [{
                        title: 'Повтор',
                        description: 'Режим повтору тепер: \`авто\`'
                    }]})
                break;
        }
    }
})

module.exports = repeat;