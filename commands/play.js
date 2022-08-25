const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const queuE = require('./queue.js');

const play = new Command(client, {
    name: 'play',
    description: 'Команда для програмання музики',
    syntax: `${client.config.prefix}play <запит музики>`,
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const member = await client.guild.members.fetch(message.author.id);
    const memberBot = await client.guild.members.fetch(client.user.id);

    if(!member.voice.channelId){
        await message.channel.send('Ви не в голосовому каналі');
        return;
    } else {
        const query = args.join(' ');
        if(!client.player.getQueue(client.guild)){ //нема черги
            const track = await client.player.search(query, {
                requestedBy: message.author
            }).then(x => x.tracks[0])

            if(!track)return await message.channel.send({ embeds: [{
                description: 'Не знайдено трек за запитом',
                hexColor: '#ffff00'
            }]})

            const queue = client.player.createQueue(client.guild, {
                leaveOnEnd: false,
                leaveOnStop: false,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 1,
                metadata: {
                    channel: message.channel
                }
            })

            try {
                if(!queue.connection) await queue.connect(member.voice.channel)
            } catch (error) {
                queue.destroy();
                await message.channel.send('Не вдалось підключитись до голосового каналу')
            }

            
                
                
            

            try {
                queue.play(track);
            } catch (error) {
                message.channel.send({embeds: [{
                    description: `На жаль, неможливо відтворити цей трек. Помилка: ${error}`,
                    hexColor: '#ff0000'
                }]})
            }
            
        } else { //є черга
            const queue = client.player.getQueue(client.guild);  
            try {
                if(!queue.connection) await queue.connect(member.voice.channel)
            } catch (error) {
                await message.channel.send('Не вдалось підключитись до голосового каналу')
            }
        
            const track = await client.player.search(query, {
                requestedBy: message.author
            }).then(x => x.tracks[0])
        
            if(!track) {
                await message.channel.send({ embeds: [{
                    description: 'Не знайдено трек за запитом',
                    hexColor: '#ffff00'
                }]});
                queue.destroy
                return;
            }
        
            await message.channel.send({embeds: [{
                title: `**${track.author}**`,
                description: `До музичної черги додано трек \`${track.title}\`\n\`Тривалість:\n${track.duration}\``,
                image: {
                    url:track.thumbnail,
                    height: 128,
                    width: 128
                }
            }]});


            if(!queue.current) {
                queue.play(track);
            } else {
                try {
                    queue.addTrack(track);
                } catch (error) {
                    message.channel.send({embeds: [{
                        description: `На жаль, неможливо додати в чергу цей трек. Помилка: ${error}`,
                        hexColor: '#ff0000'
                    }]})
                    return;
                }
            }
            
            
            
            
            if(member.voice.channelId != memberBot.voice.channelId) {
                await queue.connect(member.voice.channel);
                queue.play();
            }
        }
    }
})

module.exports = play;