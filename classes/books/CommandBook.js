const {EmbedBuilder} = require('discord.js');
const fs = require('fs');
const { createOrFindMessage } = require('../../utils/channelsUtils.js');
const {log} = require('../Logger.js');
const Book = require('./Book.js');


class CommandBook extends Book {
    constructor (client, channel_id, channel, name, text) {
        super(client, channel_id);
        this.channel = channel;
        this.name = name;
        this.description = text;
        this.functions = [];

        if(!client.commandBooks) client.commandBooks = [];
        this.index = client.commandBooks.length;
        client.commandBooks.push(this);
    }

    async start () {
        this.message = await createOrFindMessage(this.client, this.channel, {embeds: [{title: this.name, description: this.description}]})
        await this.message.reactions.removeAll();
        for(let i = 0; i < this.functions.length; i++) {
            await this.message.react(this.emojis[i]);
        }
    }

    async delete() {
        this.message.delete();
        this.client.commandBooks.splice(this.index, this.index);
        
    }
}

module.exports = CommandBook;