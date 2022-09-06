const log = require('../classes/Logger.js');
const CommandBook = require('../classes/books/CommandBook.js');

class GameQueue {
    constructor(client, game, message, user, enough, book) {
        this.client = client;
        this.game = game;
        this.message = message;
        this.book = book;
        this.GameClass = require(`../games/${game.slice(0, 1).toUpperCase()}${game.slice(1)}`);
        this.initiator = user;
        this.enough = enough;
        this.amount = 1;
        this.players = [];
        this.players.push(this.initiator);


        this.commandBook = new CommandBook(client, message.channel, message, `Черга гри в ${game}`, `1️⃣ - приєднатись до гри\nГравців в черзі: ${this.amount}\nДля початку потрібно: ${this.enough}`, this.message)
        this.commandBook.functions.push(async (user) => {

            let excluse = true;
            this.players.forEach(player => {
                if(user.id == player.id) {
                    log(`${user.id} ${player.id}`)
                   excluse = false
                   return;
                }
            })   
            if(excluse){
                this.players.push(user);
                this.amount++;
                this.commandBook.channel.send({embeds: [{
                    description: `${user} Приєднався до гри в ${this.game}`
                }]})
                this.commandBook.message.edit({embeds: [{
                    title: `Черга гри в ${game}`,
                    description: `1️⃣ - приєднатись до гри\nГравців в черзі: ${this.amount}\nДля початку потрібно: ${this.enough}`
                }]})    
                if(this.amount == this.enough){
                    log('Готово!')
                    await this.startGame()
                } 
            } 
            
            
            
            
            
            
                   
        })
        this.commandBook.start();
        if(!client.gameQueues) client.gameQueues = [];
        this.index = client.gameQueues.length;
        client.gameQueues.push(this);
    }

    async init() {this.book.delete()}

    async delete() {
        log(this.message)
        await this.commandBook.delete({message: false});
        this.client.gameQueues.splice(this.index, this.index);
        //this.commandBook.delete()
    }

    async startGame () {
        new this.GameClass(this.client, this.players, this.message.guild);
        await this.delete();
    }
}

module.exports = GameQueue;