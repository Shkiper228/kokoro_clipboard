const {EmbedBuilder} = require('discord.js');
const path_lib = require('path');
const fs = require('fs');
const log = require('../Logger.js');
const { groundChannel, createOrFindMessage } = require('../../utils/channelsUtils.js')



class InfoBook {
    constructor ({client, folder_path, channel, emojis = undefined}) {
        this.client = client;
        this.channel = channel;
        this.emojis = emojis;
        this.name = path_lib.basename(folder_path);
        this.pages = [];
        this.files = [];
        this.contentPage = '\t**ЗМІСТ**\n0️⃣ - Зміст\n';
        if(!this.emojis) {
            emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '0️⃣'];
        }

        //формування сторінок
        fs.readdirSync(`${folder_path}`).forEach((file, index) => {
            this.files.push(file.toString());
            this.pages.push([]);

            const strs = fs.readFileSync(`${folder_path}/${file.toString()}`).toString().split('\n');
            
            this.pages[this.pages.length - 1].push(`${this.emojis[this.pages.length - 1]}**${this.files[index].slice(2, -4)}**\n`)
            strs.forEach(stroke => {
                this.pages[this.pages.length - 1].push(stroke);
            })
        })


        this.length = this.pages.length;
        this.index = client.InfoBook.length;
    }

    async start () {
        if(!this.channel) {
            this.channel = await groundChannel(this.client, this.name.toString().replace(' ', '-'));
        } 
        /*this.channel.permissionOverwrites.create(this.client.guild.roles.everyone, {
			'VIEW_CHANNEL': true,
			'SEND_MESSAGES': false,
			'ADD_REACTIONS': false
		})*/

        this.message = await createOrFindMessage(this.client, this.channel, {embeds: [{
            title: 'Інформація',
            description: this.contentPage
        }]}, 2)
        client.infoBooks.push(this);
        //формування змістової сторінки
        for(let i = 0; i < this.files.length; i++){
            this.contentPage += `${this.emojis[i]} - ${this.files[i].slice(2, this.files[i].length - 4)}\n`
        }

        
        
        await this.message.reactions.removeAll();
        await this.message.react(this.emojis[this.emojis.length - 1]);

        for(let i = 0; i < this.length; i++){
            this.message.react(this.emojis[i]);
        }
    }

    changePage (pageNumber) {
        if(pageNumber != this.currentPage) {
            if(pageNumber == this.emojis.length - 1) {
                this.message.edit({embeds: [{
                    title: 'Інформація',
                    description: this.contentPage
                }]});
            } else {
                const embed = new EmbedBuilder({
                    title: 'Інформація',
                })
                console.log(this.pages[pageNumber])
                let str = '';
                this.pages[pageNumber].forEach(page => {
                    str += '\n';
                    str += page;
                })
                embed.addFields({ 
                    name: '_-||-_',
                    value: str
                });

                this.message.edit({embeds: [embed]});
            }

            this.currentPage = pageNumber;
        }
    }
}

module.exports = InfoBook;