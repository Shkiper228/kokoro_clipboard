const Command = require('../classes/Command.js');
const log = require('../classes/Logger.js');
const { checkAndConvertOfType } = require('../utils/stringAndNumsFormat.js');
const ErrorAlarm = require('../classes/ErrorAlarm.js');

const jump = new Command(client, {
    name: 'jump',
    description: 'Команда що перестрибувати на певну позицію в музичній черзі',
    syntax: `${client.config.prefix}jump <позиція трека>`,
    ownerOnly: false,
    adminOnly: false
}, async (client, message, args) => {
    const member = await client.guild.members.fetch(message.author.id);
    const memberBot = await client.guild.members.fetch(client.user.id);

    if(member.voice.channelId != memberBot.voice.channelId){
        new ErrorAlarm({
            description: 'Ви повинні бути в одному голосовому каналі з ботом, аби давати йому команди',
            timeout: 10,
            hexColor: '#ffff00',
            channel: message.channel
        })
        return;
    } else {
        if(!client.player.getQueue(client.guild)){ //нема черги
            new ErrorAlarm({
                description: 'Спочатку створіть музичну чергу',
                timeout: 10,
                hexColor: '#ffff00',
                channel: message.channel
            })
            return;
        } else {
            const queue = client.player.getQueue(client.guild);

            const num = checkAndConvertOfType(args[0], 'int');
            console.log(queue.tracks)
            const amountTracks = queue.tracks.length
            if(num && num >= 1) {
                try {
                    queue.skipTo(num - 1)
                } catch (error) {
                    log(`Не вдалось перестрибнути на іншу позицію трека музичної черги\nПомилка: ${error}`, 'error');
                }
            } else {
                if(num > amountTracks) {
                    new ErrorAlarm({
                        description: 'Треку з таким номером немає',
                        timeout: 10,
                        hexColor: '#ffff00',
                        channel: message.channel
                    })
                } else {
                    new ErrorAlarm({
                        description: 'Ви повинні ввести натуральне число',
                        timeout: 10,
                        hexColor: '#ffff00',
                        channel: message.channel
                    })
                }
                
            } 
        }
    }
})

module.exports = jump;