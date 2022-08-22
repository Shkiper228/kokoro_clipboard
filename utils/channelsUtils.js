const log = require('../classes/Logger.js');
const discord = require('discord.js');
const { ChannelType } = require('discord-api-types/v10');

async function findOrCreateChannel(client, name) {
    
    const channels = await client.guild.channels.fetch();
    
    const channel = channels.find(channel => {
        if(channel.name.toString().toLowerCase() === name.toString().replace(' ', '-').toLowerCase()) return true
    })

    let new_channel;

    if(channel) {
        new_channel = channel;
        await channel.edit({
            type: 'GUILD_TEXT'
        })
    } else {
        log(`Каналу \"${name}\" ще немає. Створюєм...`, 'warning')
        await client.guild.channels.create(name)
        .then((channel) => {new_channel = channel; log(`Канал \"${name}\" створено`)})

    }

    return new_channel;
}

module.exports.findOrCreateChannel = findOrCreateChannel;


async function groundChannel (client, name, data = {}, primary = true) {
    //try {
        const channels = await client.guild.channels.fetch(); // отримати всі канали
        data.name = name == undefined ? 'undefined' : name;
        data.type = data.type == undefined ? 0 : data.type;
        

        if(data.type != 'GUILD_TEXT' && data.type != 'GUILD_VOICE' && 
        data.type != 'GUILD_CATEGORY' && data.type != 'GUILD_NEWS' && 
        data.type != 'GUILD_STORE' && data.type != 'GUILD_NEWS_THREAD' && 
        data.type != 'GUILD_PUBLIC_THREAD' && data.type != 'GUILD_PRIVATE_THREAD' && 
        data.type != 'GUILD_STAGE_VOICE' && data.type != 'UNKNOWN') data.type = 'GUILD_TEXT';
        
        switch (data.type) {
            case 'GUILD_TEXT':
                data.type = 0;
                break;
            case 'GUILD_VOICE':
                data.type = 2;
                break;
            case 'GUILD_CATEGORY':
                data.type = 4;
                break;
            case 'GUILD_PUBLIC_THREAD':
                data.type = 11;
                break;
            case 'GUILD_PRIVATE_THREAD':
                data.type = 12;
                break;
        }

        let channel = channels.find(channel => {
            if(channel.name.toString().toLowerCase() === name.toLowerCase() && channel.type === data.type) return true;
        })

        

        if(channel){
            await channel.edit(data)
            return channel;
        } else {
            channel = await client.guild.channels.create(data);
            return channel;
        }
    //} catch (error) {
    //    log(`Щось пішло не так під час створення каналу \"${name}\"\nПомилка -> ${error}`, 'error');
    //}
    
}

module.exports.groundChannel = groundChannel;


async function createOrFindMessage(client, channel, message = {}) {
    //try {
        const messages = await channel.messages.fetch();
        let singularMessage;
        //знаходимо
        messages.forEach(msg => {
            if(msg.embeds[0] != undefined && msg.embeds[0].title == message.embeds[0].title) singularMessage = msg;
            if(msg.author.id != client.user.id) msg.delete();
        })

        //якщо нема то створюємо
        if(singularMessage) {
            log(singularMessage)
            log(`Потрібне повідомлення за заголовком ${message.embeds[0].title} знайдено`)
        } else {
            log(`Потрібного повідомлення за заголовком ${message.embeds[0].title} не знайдено. Створюємо...`, 'warning');
            singularMessage = await channel.send(message);
            log(`${singularMessage.embeds[0].title}`)
        }

        return singularMessage
    //} catch (error) {
        //log(error, 'error')
    //}
}

module.exports.createOrFindMessage = createOrFindMessage;