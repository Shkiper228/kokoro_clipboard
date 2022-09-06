const Game = require('../games/Game.js')
const log = require('../classes/Logger.js');

class TicTacToe extends Game {
    constructor (client, players, guild) {
        super(client, 'ticTacToe');
        this.crossPlayer = players[0];
        this.zeroPlayer = players[1];

        this.dateTime = new Date();
        this.guild = guild;
        console.log(guild)

        this.crossPlayerSteps = [];
        this.zeroPlayerSteps = [];
        this.completed = false;
        this.field = [['#', '#', '#'], ['#', '#', '#'], ['#', '#', '#']];
        this.chars = ['X', 'O'];
        this.emojis = ['1️⃣', '2️⃣', '3️⃣', '🛑']

        this.start();
    }

    async start() {
        this.channel = await this.guild.channels.create(`_Хрестики-нулики`, {
            userLimit: 2,
            permissionOverwrites: [{
                id: this.guild.id,
                deny: 'VIEW_CHANNEL'
            },

            {
                id: this.crossPlayer.id,
                allow: 'VIEW_CHANNEL'
            },

            {
                id: this.zeroPlayer.id,
                allow: 'VIEW_CHANNEL'
            }
            ]
        });
        this.outputMatrix();
        this.typeQuestion();
    }

    generateMatrix() {
        let string = '';
        for(const row in this.field) {
            for(const char in this.field[row]) {
                string += `${this.field[row][char]} `;
            }
            string += '\n';
        }
        return string;
    }

    outputMatrix() {
        this.channel.send({embeds: [{
            description: this.generateMatrix()
        }]})
    }

    regMove(coordinates, player) {
        log(`Координати ходу X:${coordinates[0]} Y:${coordinates[1]}`)
        if( !(this.crossPlayer == player || this.zeroPlayer == player) ) {
            const gamePlayer = player == this.crossPlayer ? this.crossPlayer : this.zeroPlayer; 
            this.channel.send({embeds: [{
                description: `${player} тебе немає серед гравців!`,
                color: '#940000'
            }]})
            return;
        }
        let char = player != this.crossPlayer ? this.chars[1] : this.chars[0];
        if (this.field[coordinates[1]][coordinates[0]] == '#') {
            this.field[coordinates[1]][coordinates[0]] = char;
        } else {
            switch (player){
                case this.crossPlayer:``
                    this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length = 0;
                    this.crossPlayerSteps.length = this.crossPlayerSteps.length - 1;
                    this.channel.send({embeds: [{
                        description: `${player} ця клітинка уже зайнята! Виберіть іншу клітинку`,
                        color: '#940000'
                    }]})
                    break;
                case this.zeroPlayer:
                    this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length = 0;
                    this.zeroPlayerSteps.length = this.zeroPlayerSteps.length - 1;
                    this.channel.send({embeds: [{
                        description: `${player} ця клітинка уже зайнята! Виберіть іншу клітинку`,
                        color: '#940000'
                    }]})
                    break;
            }
        }

        this.checkVictory();
    }

    checkVictory () {
            this.field.forEach((row, number) => {
                row.forEach((char, index) => {
                    if(char != '#') {
                        const winner = char == 'X' ? this.crossPlayer : this.zeroPlayer
                        switch (number) {
                            case 0:
                                switch (index){
                                    case 0:
                                        if ((row[1] == char && row[2] == char) ||
                                            (this.field[number + 1][index + 1] == char && this.field[number + 2][index + 2] == char) ||
                                            (this.field[number + 1][index] == char && this.field[number + 2][index] == char)) {
                                            this.declarateVictory(winner);
                                            }
                                        break;
                                    case 1:
                                        if (this.field[number + 1][index] == char && this.field[number + 2][index] == char) {
                                            this.declarateVictory(winner);
                                        }
                                        break;
                                    case 2:
                                        if (this.field[number + 1][index] == char && this.field[number + 2][index] == char ||
                                            (this.field[number + 1][index - 1] == char && this.field[number + 2][index - 2] == char)) {
                                            this.declarateVictory(winner);
                                        }
                                        break;
                                }
                                break;
                            case 1:
                                switch (index){
                                    case 0:
                                        if (row[1] == char && row[2] == char) {
                                            this.declarateVictory(char == 'X' ? this.crossPlayer : this.zeroPlayer);
                                        }
                                        break;
                                }
                                break;
                            case 2:
                                switch (index){
                                    case 0:
                                        if (row[1] == char && row[2] == char) {
                                            this.declarateVictory(char == 'X' ? this.crossPlayer : this.zeroPlayer);
                                        }
                                        break;
                                }
                                break;

                        }
                    }
                })
            })
        }

    async typeQuestion() {
        if (this.completed) {
            return;
        }

        let player = {};

        if (this.crossPlayerSteps.length == 0) { //перший хід
            player = this.crossPlayer;
        } else if (this.zeroPlayerSteps.length == 0 && this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length != 2) { //перший хід, хід хрестиків не завершено
            player = this.crossPlayer;
        } else if (this.zeroPlayerSteps.length == 0 && this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length == 2) { //перший хід, хід хрестиків завершено
            player = this.zeroPlayer
        } else if (this.crossPlayerSteps.length == this.zeroPlayerSteps.length) { //однакова кількість ходів
            if (this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length == 2 && this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                player = this.crossPlayer;
            } else if (this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length == 2 && this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length != 2) { //останній хід хрестика завершений, а нуля - ні
                player = this.zeroPlayer;
            }
        } else if(this.crossPlayerSteps.length > this.zeroPlayerSteps.length){ //кількість ходів хрестиків більше нуликів
            if (this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length == 2 && this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length == 2) { //останні ходи обох гравців завершені
                player = this.zeroPlayer;
            } else if (this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length != 2 && this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length == 2) { //останній хід хрестика завершений, а нуля - ні
                player = this.crossPlayer;
            }
        }



        let axis = '';

        if (player == this.crossPlayer) {
            if (this.crossPlayerSteps.length == 0) {
                axis = 'X';
            } else {
                axis = this.crossPlayerSteps[this.crossPlayerSteps.length - 1].length == 1 ? 'Y' : 'X'
            }
        } else if (player == this.zeroPlayer) {
            if (this.zeroPlayerSteps.length == 0) {
                axis = 'X';
            } else {
                axis = this.zeroPlayerSteps[this.zeroPlayerSteps.length - 1].length == 1 ? 'Y' : 'X'
            }
            
        }


        const message =  await this.channel.send({embeds: [{
            description: `${player} Ваш хід по координаті ${axis}`
        }]})
        log(1)
        message.react(this.emojis[0]);
        message.react(this.emojis[1]);
        message.react(this.emojis[2]);
    }

    async declarateVictory (winner) {
        this.completed = true;

        const message = await this.channel.send({embeds:[{
            description: `${winner} переміг! Для видалення гри нажміть на реакцію`
        }]})
            .then(message => {
                message.react(this.emojis[3])
            })
    }

    async remove () {
        await this.channel.send({embeds: [{
            description: 'Гра буде видалена через 30 секунд!'
        }]})
        setTimeout(() => {
            this.channel.delete();
            client.games.splice(this.index, 1);
        }, 30 * 1000)
        
    }

}

module.exports = TicTacToe;